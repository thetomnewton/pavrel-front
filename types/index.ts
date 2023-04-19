export interface User {
  id: string
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  profile_photo_url: string
}

export interface WorkspaceUser extends User {
  pivot: { role: 'member' | 'admin' }
}

export interface Idea {
  id: string
  title: string
  description: string | null
  labels: Label[]
  created_at: string
  updated_at: string
  team_id: Team['id']
  creator_id: User['id']
  status_id: string
  team_idea_id: number
  deleted_at: string | null
}

export interface PartialIdea {
  status_id: string
  creator_id: User['id']
  title?: string
  description?: string
  labels?: Label[]
}

export interface Label {
  id: string
  color: string
  name: string
}

export interface IdeaFavorite {
  id: string
  user_id: User['id']
  idea_id: Idea['id']
  workspace_id: Workspace['id']
  created_at: string
  updated_at: string
}

export interface IdeaComment {
  id: string
  comment: string
  parent_type: string
  parent_id: string
  creator_id: User['id']
  created_at: string
  updated_at: string
}

export interface IdeaStatus {
  id: string
  team_id: Team['id']
  category: number
  name: string
  default: boolean
  description: string
  created_at: string
  updated_at: string
}

export interface IdeaSubscription {
  id: string
  user_id: User['id']
  idea_id: Idea['id']
  created_at: string
  updated_at: string
}

export interface IdeaUpvote {
  id: string
  idea_id: Idea['id']
  creator_id: User['id']
  created_at: string
  updated_at: string
}

export type TeamUserRoles = 'member' | 'admin'

export interface Team {
  id: string
  name: string
  slug: string
  personal: boolean
  privacy: 'public' | 'private'
  workspace_id: Workspace['id']
  users: { id: User['id']; pivot: { role: TeamUserRoles } }[]
  labels: Label[]
  statuses: IdeaStatus[]
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  logo_url: string | null
  initial: string
  plan: 'free' | 'pro' | 'enterprise'
}

export interface WorkspaceInvitation {
  id: string
  workspace_id: Workspace['id']
  email: string
  sender_id: User['id']
  created_at: string
  updated_at: string
  claimed_at?: string
  claimer_id?: User['id']
  resent_at?: string
}

export interface WorkspaceNotification {
  id: number
  user_id: User['id']
  workspace_id: Workspace['id']
  type: 'idea.update' | 'idea.comment' | 'comment.mention'
  meta: {
    source_type: 'Idea' | 'Comment'
    source_id: string
    creator_id: User['id']
    parent_id?: string
    parent_type?: 'Idea' | 'Comment'
  }
  read_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IdeaActivity {
  id: string
  workspace_id: Workspace['id']
  idea_id: Idea['id']
  type: string
  meta: object
  created_at: string
  initiator_id: string
  initiator_type: 'user' | 'system'
}

export interface StatusUpdateActivity extends IdeaActivity {
  type: 'status.updated'
  meta: { prevStatusId: Idea['status_id']; newStatusId: Idea['status_id'] }
}

export interface TitleUpdateActivity extends IdeaActivity {
  type: 'title.updated'
  meta: { prevTitle: string; newTitle: string }
}

export interface LabelAddedActivity extends IdeaActivity {
  type: 'label.added'
  meta: { labelId: Label['id'] }
}

export interface LabelRemovedActivity extends IdeaActivity {
  type: 'label.removed'
  meta: { labelId: Label['id'] }
}

export type PossibleViewSorts = 'created' | 'updated' | 'upvotes'

export type PossibleCategoryFilters = 'all' | 'review' | 'backlog' | 'planning' | 'active'

interface StatusFilter {
  id: string
  type: 'select_status'
  data: IdeaStatus
}

interface CreatorFilter {
  id: string
  type: 'select_creator'
  data: User
}

interface LabelFilter {
  id: string
  type: 'select_labels'
  data: Label[]
}

interface ContentFilter {
  id: string
  type: 'select_content'
  data: string
}

export interface Product {
  id: number
  quantity: number
  subscription_id: Subscription['id']
  created_at: string
  updated_at: string
  stripe_id: string
  stripe_price: string
  stripe_product: string
}

export interface Subscription {
  id: number
  name: string
  workspace_id: Workspace['id']
  created_at: string
  updated_at: string
  stripe_id: string
  stripe_price: string
  stripe_status: string
  items: Product[]
}

export type IdeaFilter = StatusFilter | CreatorFilter | LabelFilter | ContentFilter
