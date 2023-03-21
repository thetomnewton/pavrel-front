import { Idea } from '../types'

interface State {
  idea: object
}

export default {
  namespaced: true,

  state: () => ({
    idea: {
      title: null,
      description: null,
      status_id: null,
      labels: [],
    },
  }),

  mutations: {
    setIdea(state: State, idea: Idea) {
      state.idea = idea
    },

    resetIdea(state: State) {
      state.idea = {
        title: null,
        description: null,
        status_id: null,
        labels: [],
      }
    },
  },
}
