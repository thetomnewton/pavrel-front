import { maxBy } from 'lodash'
import { ulid } from 'ulid'
import { Idea, PartialIdea, Team } from '../types'

export function ideaStatusSort(statusCategoryA: number, statusCategoryB: number): number {
  if (statusCategoryB === 0) return -1 // Put "removed" ones at the bottom
  if (statusCategoryA === 0) return 1 // Put "removed" ones at the bottom
  if (statusCategoryB === 6) return -1 // Then, put "done" ones
  if (statusCategoryA === 6) return 1 // Then, put "done" ones

  return statusCategoryA - statusCategoryB
}

export function generateTempIdea(idea: PartialIdea, team: Team, ideas: Idea[] = []): Idea {
  const dateString = new Date().toISOString()

  return {
    id: ulid(),
    title: idea.title || '',
    description: idea.description || '',
    created_at: dateString,
    updated_at: dateString,
    creator_id: idea.creator_id,
    status_id: idea.status_id,
    team_id: team.id,
    team_idea_id: (maxBy(ideas, 'team_idea_id')?.team_idea_id ?? 0) + 1,
    labels: idea.labels?.length ? idea.labels : [],
    deleted_at: null,
  }
}

export function getMentionsFromHtmlString(string: string): number[] {
  const div = document.createElement('div')
  div.innerHTML = string
  // @ts-ignore
  return Array.from(div.querySelectorAll('span.mention')).map(node => +node.dataset?.id)
}

export function getTagsFromHtmlString(string: string): number[] {
  const div = document.createElement('div')
  div.innerHTML = string
  // @ts-ignore
  return Array.from(div.querySelectorAll('span.tag')).map(node => +node.dataset?.id)
}
