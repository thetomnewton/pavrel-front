import Echo from 'laravel-echo'
import { useStore } from 'vuex'
import { createEcho } from '../helpers/broadcasting'
import {
  Idea,
  IdeaActivity,
  IdeaComment,
  IdeaSubscription,
  IdeaUpvote,
  Label,
  Team,
  User,
  Workspace,
  WorkspaceInvitation,
  WorkspaceNotification,
} from '../types'

type NotificationListener = { notification: WorkspaceNotification }
type IdeaListener = { idea: Idea }
type CommentListener = { comment: IdeaComment }
type UpvoteListener = { upvote: IdeaUpvote }
type TeamLabelListener = { label: Label; team: Team; userId: number }
type WorkspaceListener = { workspace: Workspace }
type InvitationListener = { invitation: WorkspaceInvitation }
type IdeaActivityListener = { ideaActivity: IdeaActivity }

export function useWebSockets() {
  const store = useStore()
  const config = useRuntimeConfig()

  let echo: Echo | undefined
  if (store.state.base.user) echo = createEcho(config.public.backendUrl, config.public.websocketHost)

  const addUserListener = () => {
    if (!store.state.base.user) return
    if (!echo) echo = createEcho(config.public.backendUrl, config.public.websocketHost)
    if (!echo) return

    echo
      .private(`App.Users.${store.state.base.user.id}`)
      .listen('WorkspaceNotificationCreated', ({ notification }: NotificationListener) => {
        store.commit('base/addWorkspaceNotification', notification)
      })
      .listen('UserUpdated', ({ user }: { user: User }) => {
        store.commit('base/setUser', user)
      })
      .listen('IdeaSubscriptionCreated', ({ subscription }: { subscription: IdeaSubscription }) => {
        store.commit('base/updateOrCreateIdeaSubscription', subscription)
      })
      .listen('IdeaSubscriptionDeleted', ({ subscriptionId }: { subscriptionId: string }) => {
        store.commit('base/deleteIdeaSubscription', subscriptionId)
      })
  }

  const addWorkspaceListeners = () => {
    if (!store.getters['base/currentWorkspace']) return
    if (!echo) echo = createEcho(config.public.backendUrl, config.public.websocketHost)
    if (!echo) return

    const workspaceId = store.getters['base/currentWorkspace'].id

    echo
      .private(`App.Workspaces.${workspaceId}`)
      .listen('IdeaCreated', ({ idea }: IdeaListener) => {
        const existingIdea = store.getters['base/getWorkspaceIdeaById'](idea.id)

        if (!existingIdea) {
          idea.labels = []
          store.commit('base/addIdeas', [idea])
        } else {
          store.commit('base/updateIdea', {
            id: idea.id,
            updatedIdea: idea,
          })
        }
      })
      .listen('IdeaUpdated', ({ idea }: IdeaListener) => {
        store.commit('base/updateIdea', { id: idea.id, updatedIdea: idea })
      })
      .listen('IdeaTrashed', ({ idea }: IdeaListener) => {
        store.commit('base/trashIdea', { id: idea.id })
      })
      .listen('CommentCreated', ({ comment }: CommentListener) => {
        store.commit('base/updateOrCreateIdeaComment', comment)
      })
      .listen('CommentUpdated', ({ comment }: CommentListener) => {
        store.commit('base/updateIdeaComment', { id: comment.id, comment })
      })
      .listen('CommentTrashed', ({ comment }: CommentListener) => {
        store.commit('base/deleteIdeaComment', comment.id)
      })
      .listen('IdeaUpvoted', ({ upvote }: UpvoteListener) => {
        store.commit('base/updateOrCreateIdeaUpvote', upvote)
      })
      .listen('IdeaUpvoteDeleted', ({ upvoteId }: { upvoteId: number }) => {
        store.commit('base/deleteIdeaUpvote', upvoteId)
      })
      .listen('TeamUpdated', ({ team }: { team: Team }) => {
        store.commit('base/updateTeam', team)
      })
      .listen('TeamDeleted', ({ team }: { team: Team }) => {
        store.commit('base/deleteTeam', team)
      })
      .listen('TeamLabelCreated', ({ team, label }: TeamLabelListener) => {
        store.commit('base/addTeamLabel', { teamId: team.id, label, workspaceId })
      })
      .listen('WorkspaceUpdated', ({ workspace }: WorkspaceListener) => {
        store.commit('base/updateWorkspace', workspace)
      })
      .listen('WorkspaceInviteCreated', ({ invitation }: InvitationListener) => {
        store.commit('base/updateOrCreateWorkspaceInvitation', invitation)
      })
      .listen('WorkspaceInviteClaimed', ({ invitation }: InvitationListener) => {
        store.commit('base/updateOrCreateWorkspaceInvitation', invitation)
      })
      .listen('IdeaActivityCreated', ({ ideaActivity }: IdeaActivityListener) => {
        store.commit('base/updateOrCreateIdeaActivity', ideaActivity)
      })
  }

  return { addUserListener, addWorkspaceListeners }
}
