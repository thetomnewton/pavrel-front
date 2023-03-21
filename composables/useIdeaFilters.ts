import { cloneDeep } from 'lodash'
import { ref } from 'vue'
import { IdeaFilter, Idea, IdeaStatus, User, Label } from '../types'

export function useIdeaFilters() {
  const filters = ref<IdeaFilter[]>([])

  const applyFilter = (data: IdeaFilter) => {
    filters.value.push(data)
  }

  const applyFiltersToIdeas = (ideas: Idea[]) => {
    let out = cloneDeep(ideas)
    filters.value.forEach(({ type, data }) => {
      switch (type) {
        case 'select_status':
          out = applyStatusFilter(out, data)
          break
        case 'select_creator':
          out = applyCreatorFilter(out, data)
          break
        case 'select_labels':
          out = applyLabelsFilter(out, data)
          break
        case 'select_content':
          out = applyContentFilter(out, data)
        default:
          break
      }
    })

    return out
  }

  const removeFilter = (filter: IdeaFilter) => {
    filters.value = filters.value.filter(existing => existing.id !== filter.id)
  }

  const applyStatusFilter = (ideas: Idea[], status: IdeaStatus) => ideas.filter(idea => idea.status_id === status.id)

  const applyCreatorFilter = (ideas: Idea[], creator: User) => ideas.filter(idea => idea.creator_id === creator.id)

  const applyLabelsFilter = (ideas: Idea[], labels: Label[]) => {
    let out = ideas
    labels.forEach(label => {
      out = out.filter(idea => idea.labels.map(l => l.id).includes(label.id))
    })

    return out
  }

  const applyContentFilter = (ideas: Idea[], content: string) =>
    ideas.filter(
      idea =>
        idea.title.toLowerCase().includes(content.toLowerCase()) ||
        idea.description?.toLowerCase().includes(content.toLowerCase())
    )

  const updateFilter = (newFilter: IdeaFilter) => {
    // If we're trying to update a filter to have an array of empty data, simply remove the filter.
    if (Array.isArray(newFilter.data) && newFilter.data.length === 0) {
      filters.value = filters.value.filter(f => f.id !== newFilter.id)
      return
    }

    // Update the existing filter
    filters.value = filters.value.map(filter => (filter.id !== newFilter.id ? filter : newFilter))
  }

  return { filters, applyFilter, applyFiltersToIdeas, removeFilter, updateFilter }
}
