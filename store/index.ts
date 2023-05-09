import { createStore } from 'vuex'
import {
  Idea,
  IdeaActivity,
  IdeaComment,
  IdeaFavorite,
  IdeaSubscription,
  IdeaUpvote,
  Team,
  User,
  Workspace,
  WorkspaceInvitation,
  WorkspaceNotification,
} from '../types'
import base from './base'
import newIdea from './new-idea'

export interface VuexStore {
  base: BaseModuleState
  newIdea: object
}

export interface BaseModuleState {
  user: User | null
  workspaces: Workspace[] | null
  teams: Team[]
  users: User[]
  ideas: Idea[]
  subscriptions: object[]
  ideaFavorites: IdeaFavorite[]
  ideaComments: IdeaComment[]
  ideaSubscriptions: IdeaSubscription[]
  ideaActivities: IdeaActivity[]
  ideaUpvotes: IdeaUpvote[]
  quickCreateIdeaModalOpen: boolean
  currentWorkspaceSlug: string | null
  workspaceNotifications: WorkspaceNotification[]
  workspaceInvitations: WorkspaceInvitation[]
  pageLoaded: boolean
  workspaceContentLoaded: boolean
  workspaceContentError: boolean
  appSidebarOpenMobile: boolean
  toastVisible: boolean
  toastTimeout: NodeJS.Timeout | null
  toastType: string | null
  toastData: object | null
  viewOptions: object
  currentTeamId: Team['id'] | null
}

export default createStore<VuexStore>({ modules: { base, newIdea } })
