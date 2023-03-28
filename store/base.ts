import { Commit, Dispatch } from 'vuex'
import { cloneDeep, uniqBy } from 'lodash-es'
import api from '../api'
import * as Sentry from '@sentry/browser'
import { BaseModuleState } from './index'
import { getMentionsFromHtmlString, getTagsFromHtmlString, ideaStatusSort } from '../helpers/ideas'
import {
  Idea,
  IdeaActivity,
  IdeaComment,
  IdeaFavorite,
  IdeaSubscription,
  IdeaUpvote,
  Label,
  Team,
  TeamUserRoles,
  User,
  Workspace,
  WorkspaceInvitation,
  WorkspaceNotification,
} from '../types'
import { ulid } from 'ulid'
import dayjs from 'dayjs'
import md5 from 'md5'

interface Getters {
  currentWorkspace: Workspace
  currentWorkspaceTeams: Team[]
  currentTeam: Team
  currentTeamIdeas: Idea[]
  getWorkspaceIdeaById: (id: Idea['id']) => Idea | undefined
  isFavorite: (idea: Idea) => boolean
  isIdeaUpvoted: (idea: Idea) => boolean
}

interface VuexAction {
  state: BaseModuleState
  getters: Getters
  commit: Commit
  dispatch: Dispatch
}

export default {
  namespaced: true,

  state: () => ({
    user: null,
    workspaces: null,
    teams: [],
    users: [],
    ideas: [],
    ideaFavorites: [],
    ideaComments: [],
    ideaSubscriptions: [],
    ideaActivities: [],
    ideaUpvotes: [],
    subscriptions: [],
    quickCreateIdeaModalOpen: false,
    currentWorkspaceSlug: null,
    workspaceNotifications: [],
    workspaceInvitations: [],
    pageLoaded: false,
    workspaceContentLoaded: false,
    workspaceContentError: false,
    appSidebarOpen: false,
    toastVisible: false,
    toastType: null,
    toastData: null,
    toastTimeout: null,
    viewOptions: { sort: 'created' },
    currentTeamId: null,
  }),

  getters: {
    initialAuthContentLoaded(state: BaseModuleState) {
      return !!(state.user && state.workspaces)
    },

    currentWorkspace(state: BaseModuleState) {
      if (state.workspaces == null) return null
      if (state.workspaces.length === 1) return state.workspaces[0]

      return state.workspaces.find(workspace => workspace?.slug === state.currentWorkspaceSlug) || null
    },

    getWorkspaceIdeaById: (state: BaseModuleState) => (id: Idea['id']) => {
      return state.ideas.find(idea => idea.id === id)
    },

    currentWorkspaceTeams(state: BaseModuleState, getters: Getters) {
      if (!getters.currentWorkspace) return []
      return state.teams
    },

    userCurrentWorkspaceTeams(state: BaseModuleState, getters: Getters) {
      return getters.currentWorkspaceTeams?.filter((team: Team) => team.users.find(({ id }) => id === state.user?.id))
    },

    currentTeam(state: BaseModuleState, getters: Getters) {
      if (!getters.currentWorkspaceTeams) return null

      return (
        getters.currentWorkspaceTeams.find(({ id }) => id === state.currentTeamId) || getters.currentWorkspaceTeams[0]
      )
    },

    currentTeamIdeas(state: BaseModuleState, getters: Getters) {
      return state.ideas.filter(idea => idea.team_id === getters.currentTeam?.id)
    },

    teamIdeas: (state: BaseModuleState) => (id: Team['id']) => {
      return state.ideas.filter(idea => idea.team_id === id)
    },

    currentTeamStatuses(state: BaseModuleState, getters: Getters) {
      return getters.currentTeam.statuses.sort((a, b) => ideaStatusSort(a.category, b.category))
    },

    getCurrentTeamIdeaById: (state: BaseModuleState, getters: Getters) => (id: Idea['id']) => {
      return getters.currentTeamIdeas.find(idea => idea.id === id)
    },

    getTeamFromIdea:
      (state: BaseModuleState, getters: Getters) =>
      (idea: Idea): Team | undefined => {
        return getters.currentWorkspaceTeams?.find((team: Team) => team.id === idea?.team_id)
      },

    unreadWorkspaceNotificationsCount: (state: BaseModuleState) => {
      return state.workspaceNotifications.filter(n => n.read_at == null).length
    },

    isIdeaUpvoted: (state: BaseModuleState) => (idea: Idea) => {
      return (
        state.ideaUpvotes.filter(upvote => upvote.creator_id === state.user?.id && upvote.idea_id === idea.id).length >
        0
      )
    },

    ideaUpvoteCount: (state: BaseModuleState) => (idea: Idea) => {
      return state.ideaUpvotes.filter(upvote => upvote.idea_id === idea.id).length
    },

    getIdeaTeamSlug: (state: BaseModuleState, getters: Getters) => (idea: Idea) => {
      return getters.currentWorkspaceTeams?.find(team => team.id === idea.team_id)?.slug
    },

    isFavorite: (state: BaseModuleState) => (idea: Idea) => {
      return !!state.ideaFavorites.find(fav => fav.idea_id === idea.id)
    },

    favoriteIdeas: (state: BaseModuleState) => {
      return state.ideas.filter((idea: Idea) => state.ideaFavorites.some(fav => fav.idea_id === idea.id))
    },

    ideaComments: (state: BaseModuleState) => (idea: Idea) => {
      const id = typeof idea === 'object' ? idea.id : idea

      return state.ideaComments.filter(comment => comment.parent_id === id && comment.parent_type === 'idea')
    },

    userById: (state: BaseModuleState) => (id: User['id']) => {
      return state.users.find(user => user.id === id)
    },

    userInTeam: (state: BaseModuleState) => {
      return state.users.length > 1
    },

    userIsSubscribedTo: (state: BaseModuleState) => (idea: Idea) => {
      return !!(
        state.user && state.ideaSubscriptions.find(sub => sub.idea_id === idea.id && sub.user_id === state.user?.id)
      )
    },
  },

  mutations: {
    setCurrentTeam(state: BaseModuleState, id: Team['id']) {
      state.currentTeamId = id
    },

    handleLogout(state: BaseModuleState) {
      state.user = null
      state.workspaces = null
      state.teams = []
      state.users = []
      state.ideas = []
      state.ideaFavorites = []
      state.ideaComments = []
      state.ideaSubscriptions = []
      state.subscriptions = []
      state.quickCreateIdeaModalOpen = false
      state.currentWorkspaceSlug = null
      state.workspaceNotifications = []
      state.pageLoaded = false
      state.workspaceContentLoaded = false
      state.appSidebarOpen = false
      state.toastVisible = false
      state.toastType = null
      state.toastData = null
      state.currentTeamId = null
    },

    setViewOptions(state: BaseModuleState, newOptions: object) {
      state.viewOptions = newOptions
    },

    setIdeaSubscriptions(state: BaseModuleState, data: IdeaSubscription[]) {
      state.ideaSubscriptions = data
    },

    setSubscriptions(state: BaseModuleState, data: object[]) {
      state.subscriptions = data
    },

    setUpvotes(state: BaseModuleState, data: IdeaUpvote[]) {
      state.ideaUpvotes = data
    },

    toggleAppSidebar(state: BaseModuleState) {
      state.appSidebarOpen = !state.appSidebarOpen
    },

    setPageLoaded(state: BaseModuleState) {
      state.pageLoaded = true
    },

    setUser(state: BaseModuleState, user: User) {
      state.user = user

      if (user?.id) Sentry.setUser({ id: user.id.toString(), email: user.email })
      else Sentry.configureScope((scope: { setUser: (u: object | null) => void }) => scope.setUser(null))

      if (!state.users.find(({ id }) => id === user.id)) state.users.push(user)
      else state.users = state.users.map(baseUser => (baseUser.id !== user.id ? baseUser : user))
    },

    setUsers(state: BaseModuleState, users: User[]) {
      state.users = users
    },

    setWorkspaceNotifications(state: BaseModuleState, notifications: WorkspaceNotification[]) {
      state.workspaceNotifications = notifications
    },

    addWorkspaceNotification(state: BaseModuleState, notification: WorkspaceNotification) {
      state.workspaceNotifications.push(notification)
    },

    markNotificationAsRead(state: BaseModuleState, notification: WorkspaceNotification) {
      const savedNotification = state.workspaceNotifications.find(({ id }) => id === notification.id)
      if (!savedNotification) return

      savedNotification.read_at = new Date().toISOString()
    },

    markNotificationAsUnread(state: BaseModuleState, notification: WorkspaceNotification) {
      const savedNotification = state.workspaceNotifications.find(({ id }) => id === notification.id)
      if (!savedNotification) return

      savedNotification.read_at = null
    },

    trashNotification(state: BaseModuleState, notification: WorkspaceNotification) {
      const savedNotification = state.workspaceNotifications.find(({ id }) => id === notification.id)
      if (!savedNotification) return

      savedNotification.deleted_at = new Date().toISOString()
    },

    untrashNotification(state: BaseModuleState, notification: WorkspaceNotification) {
      const savedNotification = state.workspaceNotifications.find(({ id }) => id === notification.id)
      if (!savedNotification) return

      savedNotification.deleted_at = null
    },

    setWorkspaces(state: BaseModuleState, workspaces: Workspace[]) {
      state.workspaces = workspaces
    },

    setCurrentWorkspaceFromSlug(state: BaseModuleState, slug: string) {
      state.currentWorkspaceSlug = slug
      localStorage.setItem('last-workspace', slug)
    },

    setCurrentWorkspaceFromMostRecent(state: BaseModuleState) {
      if (!state.workspaces?.length) return

      const lastWorkspace = localStorage.getItem('last-workspace')
      if (lastWorkspace && state.workspaces.find(({ slug }) => slug === lastWorkspace)) {
        state.currentWorkspaceSlug = lastWorkspace
        return
      }

      state.currentWorkspaceSlug = state.workspaces[state.workspaces.length - 1].slug
    },

    setWorkspaceTeams(state: BaseModuleState, { teams }: { teams: Team[] }) {
      state.teams = teams
    },

    addTeam(state: BaseModuleState, team: Team) {
      state.teams.push(team)
    },

    updateTeam(state: BaseModuleState, team: Team) {
      state.teams = state.teams.map(origTeam => (team.id !== origTeam.id ? origTeam : team))
    },

    leaveTeam(state: BaseModuleState, team: Team) {
      state.teams = state.teams.map(oldTeam => {
        if (oldTeam.id !== team.id) return oldTeam

        const newTeam = cloneDeep(oldTeam)
        newTeam.users = newTeam.users.filter(({ id }) => id !== state.user?.id)
        return newTeam
      })
    },

    joinTeam(state: BaseModuleState, teamId: Team['id']) {
      state.teams = state.teams.map(team => {
        if (team.id !== teamId) return team

        const newTeam = cloneDeep(team)
        if (state.user)
          newTeam.users.push({
            id: state.user.id,
            pivot: { role: 'member' },
          })
        return newTeam
      })
    },

    addMembersToTeam(state: BaseModuleState, { members, teamId }: { members: User['id'][]; teamId: Team['id'] }) {
      state.teams = state.teams.map(team => {
        if (team.id !== teamId) return team

        const newTeam = cloneDeep(team)
        const users = members.map(member => ({ id: member, pivot: { role: 'member' as const } }))

        newTeam.users.push(...users)
        return newTeam
      })
    },

    updateTeamUserRole(
      state: BaseModuleState,
      { teamId, userId, role }: { teamId: Team['id']; userId: User['id']; role: TeamUserRoles }
    ) {
      state.teams = state.teams.map(team => {
        if (team.id !== teamId) return team

        const newTeam = cloneDeep(team)
        newTeam.users = newTeam.users.map(user => {
          if (user.id !== userId) return user
          user.pivot.role = role
          return user
        })

        return newTeam
      })
    },

    deleteTeam(state: BaseModuleState, team: Team) {
      state.teams = state.teams.filter(({ id }) => id !== team.id)
      state.ideas = state.ideas.filter(({ team_id }) => team_id !== team.id)
    },

    disbandTeam(state: BaseModuleState, team: Team) {
      state.ideas = state.ideas.filter(idea => idea.team_id !== team.id)
      state.teams = state.teams.filter(({ id }) => id !== team.id)
    },

    removeUserFromTeam(state: BaseModuleState, { user, team }: { user: User; team: Team }) {
      state.teams = state.teams.map(storeTeam => {
        if (storeTeam.id !== team.id) return storeTeam

        const newTeam = cloneDeep(storeTeam)
        newTeam.users = newTeam.users.filter(({ id }) => id !== user.id)
        return newTeam
      })
    },

    setWorkspaceContentLoaded(state: BaseModuleState, status = true) {
      state.workspaceContentLoaded = status
    },

    setWorkspaceContentError(state: BaseModuleState) {
      state.workspaceContentError = true
    },

    addIdeas(state: BaseModuleState, ideas: Idea[]) {
      const baseIdeas = cloneDeep(state.ideas)
      baseIdeas.push(...ideas)
      state.ideas = uniqBy(baseIdeas, 'id')
    },

    updateIdea(state: BaseModuleState, { id, updatedIdea }: { id: Idea['id']; updatedIdea: Idea }) {
      const index = state.ideas.findIndex(idea => idea.id === id)
      if (index < 0) return

      state.ideas.splice(index, 1, { ...{ labels: [] }, ...state.ideas[index], ...updatedIdea })
    },

    deleteIdea(state: BaseModuleState, { id }: { id: Idea['id'] }) {
      state.ideas = state.ideas.filter(idea => idea.id !== id)
    },

    trashIdea(state: BaseModuleState, id: Idea['id']) {
      const index = state.ideas.findIndex(idea => idea.id === id)
      if (index > -1) state.ideas[index].deleted_at = new Date().toISOString()
    },

    trashIdeas(state: BaseModuleState, ids: Idea['id'][]) {
      state.ideas = state.ideas.map(idea => {
        if (ids.includes(idea.id)) idea.deleted_at = new Date().toISOString()
        return idea
      })
    },

    untrashIdea(state: BaseModuleState, id: Idea['id']) {
      state.ideas = state.ideas.map(idea => {
        if (idea.id === id) idea.deleted_at = null

        return idea
      })
    },

    setIdeaComments(state: BaseModuleState, data: IdeaComment[]) {
      state.ideaComments = cloneDeep(data)
    },

    addIdeaComment(state: BaseModuleState, comment: IdeaComment) {
      state.ideaComments.push(comment)
    },

    updateIdeaComment(state: BaseModuleState, { id, comment }: { id: string; comment: IdeaComment }) {
      state.ideaComments = state.ideaComments.map(orig => (orig.id !== id ? orig : comment))
    },

    updateOrCreateIdeaComment(state: BaseModuleState, comment: IdeaComment) {
      let updated

      state.ideaComments = state.ideaComments.map(orig => {
        if (orig.id !== comment.id) return orig
        updated = true
        return comment
      })

      if (!updated) state.ideaComments.push(comment)
    },

    deleteIdeaComment(state: BaseModuleState, id: IdeaComment['id']) {
      state.ideaComments = state.ideaComments.filter(c => c.id !== id)
    },

    toggleQuickCreateIdeaModal(state: BaseModuleState) {
      state.quickCreateIdeaModalOpen = !state.quickCreateIdeaModalOpen
    },

    setIdeaFavorites(state: BaseModuleState, ideaFavorites: IdeaFavorite[]) {
      state.ideaFavorites = ideaFavorites
    },

    addFavorite(
      state: BaseModuleState,
      { idea, workspace, id = null }: { idea: Idea; workspace: Workspace; id: string | null }
    ) {
      if (!state.user) return

      const currentDate = new Date().toISOString()

      state.ideaFavorites.push({
        id: id ?? ulid(),
        created_at: currentDate,
        updated_at: currentDate,
        idea_id: idea.id,
        workspace_id: workspace.id,
        user_id: state.user.id,
      })
    },

    unsubscribeFromIdea(state: BaseModuleState, idea: Idea) {
      const index = state.ideaSubscriptions.findIndex(sub => sub.user_id === state.user?.id && sub.idea_id === idea.id)
      state.ideaSubscriptions.splice(index, 1)
    },

    subscribeToIdea(state: BaseModuleState, { idea, id }: { idea: Idea; id: string }) {
      if (!state.user) return

      state.ideaSubscriptions.push({
        id: id ?? ulid(),
        user_id: state.user.id,
        idea_id: idea.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    },

    updateOrCreateIdeaSubscription(state: BaseModuleState, subscription: IdeaSubscription) {
      let flag
      state.ideaSubscriptions = state.ideaSubscriptions.map(sub => {
        if (sub.id !== subscription.id) return sub
        flag = true
        return subscription
      })

      if (!flag) state.ideaSubscriptions.push(subscription)
    },

    deleteIdeaSubscription(state: BaseModuleState, subscriptionId: string) {
      state.ideaSubscriptions = state.ideaSubscriptions.filter(({ id }) => id !== subscriptionId)
    },

    removeFavorite(state: BaseModuleState, idea: Idea) {
      state.ideaFavorites = state.ideaFavorites.filter(fav => fav.idea_id !== idea.id)
    },

    updateFavoriteForIdea(state: BaseModuleState, { idea, favorite }: { idea: Idea; favorite: IdeaFavorite }) {
      const index = state.ideaFavorites.findIndex(fav => fav.idea_id === idea.id)
      if (index === -1) return

      state.ideaFavorites.splice(index, 1, favorite)
    },

    addTeamLabel(
      state: BaseModuleState,
      { teamId, label, workspaceId }: { teamId: string; label: Label; workspaceId: number }
    ) {
      const team = state.teams.find(({ id }) => id === teamId)
      if (team) team.labels.push(label)
    },

    addLabelToIdea(
      state: BaseModuleState,
      { ideaId, labelId, labels }: { ideaId: string; labelId: string; labels: Label[] }
    ) {
      const idea = state.ideas.find(({ id }) => id === ideaId)
      if (!idea) return

      const label = labels.find(({ id }) => id === labelId)
      if (!label) return

      idea.labels.push(label)
    },

    removeLabelFromIdea(state: BaseModuleState, { ideaId, labelId }: { ideaId: string; labelId: string }) {
      const idea = state.ideas.find(({ id }) => id === ideaId)
      if (!idea) return

      const index = idea.labels.findIndex(({ id }) => id === labelId)
      idea.labels.splice(index, 1)
    },

    showToast(state: BaseModuleState, { type, data }: { type: string; data: object }) {
      if (state.toastTimeout) clearTimeout(state.toastTimeout)
      state.toastType = type
      state.toastData = data
      state.toastVisible = true

      state.toastTimeout = setTimeout(() => {
        state.toastVisible = false
        state.toastType = null
        state.toastData = null
      }, 10000)
    },

    hideToast(state: BaseModuleState) {
      state.toastVisible = false
      state.toastType = null
      state.toastData = null
      if (state.toastTimeout) clearTimeout(state.toastTimeout)
    },

    upvoteIdea(state: BaseModuleState, { idea, id }: { idea: Idea; id: string }) {
      state.ideaUpvotes.push({
        id,
        idea_id: idea.id,
        creator_id: (state.user as User).id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    },

    unupvoteIdea(state: BaseModuleState, idea: Idea) {
      const index = state.ideaUpvotes.findIndex(u => u.idea_id === idea.id && u.creator_id == (state.user as User).id)

      if (index > -1) state.ideaUpvotes.splice(index, 1)
    },

    addIdeaUpvote(state: BaseModuleState, upvote: IdeaUpvote) {
      state.ideaUpvotes.push(upvote)
    },

    deleteIdeaUpvote(state: BaseModuleState, upvoteId: string) {
      const index = state.ideaUpvotes.findIndex(u => u.id === upvoteId)

      if (index > -1) state.ideaUpvotes.splice(index, 1)
    },

    updateIdeaUpvote(state: BaseModuleState, { ideaId, upvote }: { ideaId: string; upvote: IdeaUpvote }) {
      const index = state.ideaUpvotes.findIndex(u => u.idea_id === ideaId && u.creator_id === (state.user as User).id)

      if (index > -1) state.ideaUpvotes.splice(index, 1, upvote)
    },

    updateOrCreateIdeaUpvote(state: BaseModuleState, upvote: IdeaUpvote) {
      const index = state.ideaUpvotes.findIndex(u => u.id === upvote.id)

      if (index === -1) state.ideaUpvotes.push(upvote)
      else state.ideaUpvotes.splice(index, 1, upvote)
    },

    setIdeaActivities(state: BaseModuleState, activities: IdeaActivity[]) {
      state.ideaActivities = activities
    },

    updateOrCreateIdeaActivity(state: BaseModuleState, activity: IdeaActivity) {
      const search = state.ideaActivities.findIndex(localActivity => {
        return (
          localActivity.type === activity.type &&
          localActivity.idea_id === activity.idea_id &&
          localActivity.initiator_id === activity.initiator_id &&
          localActivity.initiator_type === activity.initiator_type &&
          // @ts-ignore
          Object.keys(localActivity.meta).every(value => localActivity.meta[value] === activity.meta[value])
        )
      })

      if (search >= 0) state.ideaActivities.splice(search, 1, activity)
      else state.ideaActivities.push(activity)
    },

    labelCreationActivity(
      state: BaseModuleState,
      {
        ideaId,
        labelId,
        workspaceId,
        initiatorId,
      }: {
        ideaId: Idea['id']
        labelId: Label['id']
        workspaceId: Workspace['id']
        initiatorId: User['id']
      }
    ) {
      state.ideaActivities.push({
        id: ulid(),
        idea_id: ideaId,
        workspace_id: workspaceId,
        meta: { labelId },
        type: 'label.added',
        initiator_id: initiatorId,
        initiator_type: 'user' as const,
        created_at: new Date().toISOString(),
      })
    },

    labelRemovalActivity(
      state: BaseModuleState,
      {
        ideaId,
        labelId,
        workspaceId,
        initiatorId,
      }: {
        ideaId: Idea['id']
        labelId: Label['id']
        workspaceId: Workspace['id']
        initiatorId: User['id']
      }
    ) {
      state.ideaActivities.push({
        id: ulid(),
        idea_id: ideaId,
        workspace_id: workspaceId,
        meta: { labelId },
        type: 'label.removed',
        initiator_id: initiatorId,
        initiator_type: 'user' as const,
        created_at: new Date().toISOString(),
      })
    },

    updateWorkspace(state: BaseModuleState, workspace: Workspace) {
      const index = state.workspaces?.findIndex(({ id }) => id === workspace.id)

      if (index !== undefined && index > -1) state.workspaces?.splice(index, 1, workspace)
    },

    setWorkspaceInvitations(state: BaseModuleState, invitations: WorkspaceInvitation[]) {
      state.workspaceInvitations = invitations
    },

    createWorkspaceInvitation(state: BaseModuleState, invitation: WorkspaceInvitation) {
      state.workspaceInvitations.push(invitation)
    },

    updateWorkspaceInvitation(state: BaseModuleState, invitation: WorkspaceInvitation) {
      state.workspaceInvitations = state.workspaceInvitations.map(i => {
        if (i.id !== invitation.id) return i
        return invitation
      })
    },

    cancelWorkspaceInvitation(state: BaseModuleState, { id }: WorkspaceInvitation) {
      state.workspaceInvitations = state.workspaceInvitations.filter(invite => invite.id !== id)
    },

    updateOrCreateWorkspaceInvitation(state: BaseModuleState, invitation: WorkspaceInvitation) {
      let updated = false
      state.workspaceInvitations = state.workspaceInvitations.map(i => {
        if (i.id !== invitation.id) return i
        updated = true
        return invitation
      })

      if (!updated) state.workspaceInvitations.push(invitation)
    },

    logIdeaStatusUpdate(
      state: BaseModuleState,
      data: {
        ideaId: Idea['id']
        workspaceId: Workspace['id']
        prevStatusId: Idea['status_id']
        newStatusId: Idea['status_id']
      }
    ) {
      if (!state.user) return

      state.ideaActivities.push({
        id: ulid(),
        type: 'status.updated',
        workspace_id: data.workspaceId,
        idea_id: data.ideaId,
        initiator_id: state.user.id,
        initiator_type: 'user',
        created_at: dayjs().toISOString(),
        meta: {
          prevStatusId: data.prevStatusId,
          newStatusId: data.newStatusId,
        },
      })
    },

    logIdeaTitleUpdate(
      state: BaseModuleState,
      data: {
        ideaId: Idea['id']
        workspaceId: Workspace['id']
        prevTitle: Idea['title']
        newTitle: Idea['title']
      }
    ) {
      if (!state.user) return

      state.ideaActivities.push({
        id: ulid(),
        type: 'title.updated',
        workspace_id: data.workspaceId,
        idea_id: data.ideaId,
        initiator_id: state.user.id,
        initiator_type: 'user',
        created_at: dayjs().toISOString(),
        meta: {
          prevTitle: data.prevTitle,
          newTitle: data.newTitle,
        },
      })
    },

    logIdeaDescriptionUpdate(
      state: BaseModuleState,
      data: {
        ideaId: Idea['id']
        workspaceId: Workspace['id']
        newDescription: string
      }
    ) {
      if (!state.user) return

      state.ideaActivities.push({
        id: ulid(),
        type: 'description.updated',
        workspace_id: data.workspaceId,
        idea_id: data.ideaId,
        initiator_id: state.user.id,
        initiator_type: 'user',
        created_at: dayjs().toISOString(),
        meta: {
          newDescriptionHash: md5(data.newDescription),
        },
      })
    },
  },

  actions: {
    async loadAllWorkspaceContent({ commit, dispatch }: VuexAction) {
      await Promise.all([
        dispatch('getIdeaFavorites'),
        dispatch('getIdeas'),
        dispatch('getCurrentWorkspaceTeams'),
        dispatch('getIdeaComments'),
        dispatch('getWorkspaceUsers'),
        dispatch('getWorkspaceNotifications'),
        dispatch('getIdeaSubscriptions'),
        dispatch('getSubscriptions'),
        dispatch('getUpvotes'),
        dispatch('getIdeaActivities'),
      ])
        .then(() => commit('setWorkspaceContentLoaded'))
        .catch(e => {
          console.log(e)

          commit('setWorkspaceContentError')
        })
    },

    async createTeam(
      { getters, commit }: VuexAction,
      { name, slug, privacy }: { name: Team['name']; slug: Team['slug']; privacy: Team['privacy'] }
    ) {
      try {
        const { data: team } = await api.post(`/workspaces/${getters.currentWorkspace.id}/teams`, {
          name,
          slug,
          privacy,
        })
        commit('addTeam', team)
        return team
      } catch (e) {
        throw new Error('Team creation failed')
      }
    },

    async updateTeam({ getters }: VuexAction, team: Team) {
      const { id, name, slug, privacy } = team
      await api.put(`/workspaces/${getters.currentWorkspace.id}/teams/${id}`, { name, slug, privacy })
    },

    async leaveTeam({ getters }: VuexAction, team: Team) {
      await api.delete(`/workspaces/${getters.currentWorkspace.id}/teams/${team.id}/users/me`)
    },

    async joinTeam({ getters }: VuexAction, teamId: Team['id']) {
      await api.post(`/workspace/${getters.currentWorkspace.id}/teams/join`, { teams: [teamId] })
    },

    async addMembersToTeam(
      { getters }: VuexAction,
      { members, teamId }: { members: User['id'][]; teamId: Team['id'] }
    ) {
      await Promise.allSettled(
        members.map(id => api.post(`/workspaces/${getters.currentWorkspace.id}/teams/${teamId}/users`, { id }))
      )
    },

    async updateTeamUserRole(
      { getters }: VuexAction,
      { userId, teamId, role }: { userId: User['id']; teamId: Team['id']; role: TeamUserRoles }
    ) {
      api.put(`/workspaces/${getters.currentWorkspace.id}/teams/${teamId}/users/${userId}`, { role })
    },

    async disbandTeam({ getters }: VuexAction, team: Team) {
      await api.delete(`/workspaces/${getters.currentWorkspace.id}/teams/${team.id}`)
    },

    async removeUserFromTeam({ getters }: VuexAction, { user, team }: { user: User; team: Team }) {
      await api.delete(`/workspaces/${getters.currentWorkspace.id}/teams/${team.id}/users/${user.id}`)
    },

    async getWorkspaces({ commit }: VuexAction) {
      const { data } = await api.get('/workspaces')
      commit('setWorkspaces', data)
    },

    async getCurrentWorkspaceTeams({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/teams`)
      commit('setWorkspaceTeams', {
        teams: data,
      })
    },

    async getIdeas({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/ideas`)
      if (data == null) return
      commit('addIdeas', data)
    },

    async getWorkspaceUsers({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/users`)
      if (data == null) return

      commit('setUsers', data)
    },

    async getWorkspaceNotifications({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/notifications?trashed=true`)
      if (data == null) return

      commit('setWorkspaceNotifications', data)
    },

    async markNotificationAsRead({ getters, commit }: VuexAction, notification: WorkspaceNotification) {
      await api
        .post(`/workspaces/${getters.currentWorkspace.id}/notifications/${notification.id}`, {
          read_at: new Date().toISOString(),
        })
        .catch(() => {
          commit('markNotificationAsUnread', notification)
        })
    },

    async markNotificationAsUnread({ getters, commit }: VuexAction, notification: WorkspaceNotification) {
      const wasOriginallyUnread = notification.read_at == null

      await api
        .post(`/workspaces/${getters.currentWorkspace.id}/notifications/${notification.id}`, {
          read_at: null,
        })
        .catch(() => {
          if (!wasOriginallyUnread) commit('markNotificationAsRead', notification)
        })
    },

    async deleteNotification({ getters, commit }: VuexAction, notification: WorkspaceNotification) {
      await api.delete(`/workspaces/${getters.currentWorkspace.id}/notifications/${notification.id}`).catch(() => {
        commit('untrashNotification', notification)
      })
    },

    async getIdeaSubscriptions({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/ideas/subscriptions`)
      if (data == null) return

      commit('setIdeaSubscriptions', data)
    },

    async unsubscribeFromIdea({ getters, commit }: VuexAction, idea: Idea) {
      commit('unsubscribeFromIdea', idea)
      await api.get(`/workspaces/${getters.currentWorkspace.id}/ideas/${idea.id}/unsubscribe`)
    },

    async subscribeToIdea({ getters, commit }: VuexAction, idea: Idea) {
      const id = ulid()
      commit('subscribeToIdea', { idea, id })

      await api.post(`/workspaces/${getters.currentWorkspace.id}/ideas/${idea.id}/subscribe`, { id })
    },

    async getSubscriptions({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/subscriptions`)
      if (data == null) return

      commit('setSubscriptions', data)
    },

    async getUpvotes({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/idea-upvotes`)
      if (data == null) return

      commit('setUpvotes', data)
    },

    async toggleUpvoteIdea({ getters, dispatch }: VuexAction, idea: Idea) {
      if (getters.isIdeaUpvoted(idea)) dispatch('unupvoteIdea', idea)
      else dispatch('upvoteIdea', idea)
    },

    async upvoteIdea({ getters, commit }: VuexAction, idea: Idea) {
      if (getters.isIdeaUpvoted(idea)) return

      const id = ulid()
      commit('upvoteIdea', { idea, id })

      await api.post(`/workspaces/${getters.currentWorkspace.id}/ideas/${idea.id}/upvote`, { id })
    },

    async unupvoteIdea({ getters, commit }: VuexAction, idea: Idea) {
      if (!getters.isIdeaUpvoted(idea)) return

      commit('unupvoteIdea', idea)
      await api.post(`/workspaces/${getters.currentWorkspace.id}/ideas/${idea.id}/unupvote`)
    },

    async getIdeaActivities({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/idea-activities`)
      if (data == null) return

      commit('setIdeaActivities', data)
    },

    async getIdeaComments({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/comments`)
      if (data == null) return
      commit('setIdeaComments', data)
    },

    async addIdeaComment(
      { state, getters, commit }: VuexAction,
      { ideaId, comment }: { ideaId: number; comment: IdeaComment }
    ) {
      const id = ulid()
      const now = new Date().toISOString()

      commit('addIdeaComment', {
        ...{
          id,
          parent_type: 'idea',
          parent_id: ideaId,
          creator_id: state.user?.id,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
        ...comment,
      })

      const mentions = getMentionsFromHtmlString(comment.comment || '')
      const tags = getTagsFromHtmlString(comment.comment || '')

      await api.post(`/workspaces/${getters.currentWorkspace.id}/ideas/${ideaId}/comments`, {
        id,
        comment: comment.comment,
        mentions,
        tags,
      })
    },

    async updateIdeaComment({ getters, commit }: VuexAction, { id, comment }: { id: number; comment: IdeaComment }) {
      commit('updateIdeaComment', { id, comment })

      const mentions = getMentionsFromHtmlString(comment.comment || '')
      const tags = getTagsFromHtmlString(comment.comment || '')

      await api.post(`/workspaces/${getters.currentWorkspace.id}/comments/${comment.id}`, {
        comment: comment.comment,
        mentions,
        tags,
      })
    },

    async deleteIdeaComment({ getters, commit }: VuexAction, comment: IdeaComment) {
      commit('deleteIdeaComment', comment.id)
      await api.delete(`/workspaces/${getters.currentWorkspace.id}/comments/${comment.id}`)
    },

    async getIdeaFavorites({ getters, commit }: VuexAction) {
      const { data } = await api.get(`/workspaces/${getters.currentWorkspace.id}/favorites`)
      commit('setIdeaFavorites', data)
    },

    async saveAddFavorite({ getters }: VuexAction, { idea, id }: { idea: Idea; id: string }) {
      await api.post(`/workspaces/${getters.currentWorkspace.id}/ideas/${idea.id}/favorite`, { id })
    },

    async saveRemoveFavorite({ getters }: VuexAction, idea: Idea) {
      await api.delete(`/workspaces/${getters.currentWorkspace.id}/ideas/${idea.id}/unfavorite`)
    },

    async toggleFavorite({ getters, commit, dispatch }: VuexAction, idea: Idea) {
      if (!getters.isFavorite(idea)) {
        const id = ulid()
        commit('addFavorite', {
          idea: idea,
          workspace: getters.currentWorkspace,
          id,
        })
        dispatch('saveAddFavorite', { idea, id })
      } else {
        commit('removeFavorite', idea)
        dispatch('saveRemoveFavorite', idea)
      }
    },

    // This assumes the idea has already been temporarily added to the list of ideas.
    // It gets the correct data back from the server, then updates the idea.
    async saveNewIdea({ getters }: VuexAction, { team, idea }: { team: Team; idea: Idea }) {
      // Convert label objects back to IDs to send to the API
      const baseIdea = cloneDeep(idea)
      if (idea.labels.length && idea.labels.some(label => label.id)) {
        // @ts-ignore
        baseIdea.labels = baseIdea.labels.map(({ id }) => id)
      }

      const mentions = getMentionsFromHtmlString(baseIdea.description || '')
      const tags = getTagsFromHtmlString(baseIdea.description || '')

      await api.post(`/workspaces/${getters.currentWorkspace.id}/teams/${team.id}/ideas`, {
        idea: baseIdea,
        mentions,
        tags,
      })
    },

    async saveLabel({ getters }: VuexAction, label: Label) {
      const team = getters.currentTeam

      // Once the real ID from the database comes back, update the label
      const { data }: { data: Label } = await api.post(
        `/workspaces/${getters.currentWorkspace.id}/teams/${team.id}/labels`,
        label
      )

      const index = team.labels.findIndex(({ id }: Label) => id === label.id)

      team.labels.splice(index, 1, data)

      return data
    },

    async updateIdea({ getters, commit, dispatch }: VuexAction, idea: Idea) {
      const orig = getters.getWorkspaceIdeaById(idea.id)

      const updatedIdea = cloneDeep(idea)
      commit('updateIdea', { id: idea.id, updatedIdea })

      dispatch('logIdeaUpdate', { orig, idea: updatedIdea })

      const mentions = getMentionsFromHtmlString(idea.description || '')
      const tags = getTagsFromHtmlString(idea.description || '')

      const path = `/workspaces/${getters.currentWorkspace.id}/teams/${idea.team_id}/ideas/${idea.team_idea_id}`
      await api.post(path, { idea, mentions, tags })
    },

    async deleteIdea({ getters }: VuexAction, idea: Idea) {
      await api.delete(`/workspaces/${getters.currentWorkspace.id}/teams/${idea.team_id}/ideas/${idea.id}`)
    },

    async bulkDeleteIdeas({ getters, commit }: VuexAction, ids: Idea['id'][]) {
      commit('trashIdeas', ids)

      const { data } = await api.post(`/workspaces/${getters.currentWorkspace.id}/ideas/delete`, { ids })

      // If the server response was that the idea was not trashed,
      // locally un-trash every idea of ID "key".
      for (const [key, value] of Object.entries(data)) {
        if (!value) commit('untrashIdea', key)
      }
    },

    async logIdeaUpdate({ getters, commit }: VuexAction, { orig, idea }: { idea: Idea; orig?: Idea }) {
      if (!orig) return

      if (orig.status_id !== idea.status_id) {
        commit('logIdeaStatusUpdate', {
          workspaceId: getters.currentWorkspace.id,
          ideaId: idea.id,
          newStatusId: idea.status_id,
          prevStatusId: orig.status_id,
        })
      }

      if (orig.title !== idea.title) {
        commit('logIdeaTitleUpdate', {
          workspaceId: getters.currentWorkspace.id,
          ideaId: idea.id,
          newTitle: idea.title,
          prevTitle: orig.title,
        })
      }

      if (orig.description !== idea.description) {
        commit('logIdeaDescriptionUpdate', {
          workspaceId: getters.currentWorkspace.id,
          ideaId: idea.id,
          newDescription: idea.description,
        })
      }
    },
  },
}
