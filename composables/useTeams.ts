import { useStore } from 'vuex'
import { Idea, Team, TeamUserRoles, User, Workspace } from '../types'

export function useTeams() {
  const store = useStore()

  const { user } = useUsers()

  const currentWorkspace = computed<Workspace | undefined>(() => store.getters['base/currentWorkspace'])
  const currentTeam = computed<Team>(() => store.getters['base/currentTeam'])
  const currentWorkspaceTeams = computed<Team[]>(() => store.state.base.teams)
  const draftTeam = computed<Team | undefined>(() => (store.state.base.teams as Team[]).find(team => team.personal))

  const publicTeamsToJoin = computed<Team[]>(() =>
    currentWorkspaceTeams.value.filter(
      team => !team.personal && team.privacy === 'public' && !team.users.map(({ id }) => id).includes(user.value.id)
    )
  )

  const totalIdeasInTeam = (team: Team) =>
    store.state.base.ideas.filter((idea: Idea) => idea.team_id === team.id).length

  const getTeamFromIdea = computed<(idea: Idea) => Team | undefined>(() => store.getters['base/getTeamFromIdea'])

  const setCurrentTeam = ({ workspaceId, teamId }: { workspaceId: Workspace['id']; teamId: Team['id'] }) => {
    setCurrentTeamInLocalStorage({ teamId, workspaceId })

    store.commit('base/setCurrentTeam', teamId)
  }

  const createTeam = (partialTeam: { name: Team['name']; slug: Team['slug']; privacy: Team['privacy'] }) =>
    store.dispatch('base/createTeam', partialTeam)

  const updateTeam = (team: Team) => {
    store.commit('base/updateTeam', team)
    store.dispatch('base/updateTeam', team)
  }

  const leaveTeam = (team: Team) => {
    store.commit('base/leaveTeam', team)
    store.dispatch('base/leaveTeam', team)
  }

  const disbandTeam = (team: Team) => {
    store.commit('base/disbandTeam', team)
    store.dispatch('base/disbandTeam', team)
  }

  const removeUserFromTeam = (args: { user: User; team: Team }) => {
    store.commit('base/removeUserFromTeam', args)
    store.dispatch('base/removeUserFromTeam', args)
  }

  const joinTeam = (teamId: Team['id']) => {
    store.commit('base/joinTeam', teamId)
    store.dispatch('base/joinTeam', teamId)
  }

  const addMembersToTeam = (members: User['id'][], teamId: Team['id']) => {
    store.commit('base/addMembersToTeam', { members, teamId })
    store.dispatch('base/addMembersToTeam', { members, teamId })
  }

  const updateTeamUserRole = ({
    userId,
    teamId,
    role,
  }: {
    userId: User['id']
    teamId: Team['id']
    role: TeamUserRoles
  }) => {
    store.commit('base/updateTeamUserRole', { userId, teamId, role })
    store.dispatch('base/updateTeamUserRole', { userId, teamId, role })
  }

  const setCurrentTeamInLocalStorage = ({
    workspaceId,
    teamId,
  }: {
    workspaceId: Workspace['id']
    teamId: Team['id']
  }) => {
    let currentTeams
    try {
      currentTeams = JSON.parse(localStorage.getItem('current-teams') ?? '{}')
    } catch (e) {
      currentTeams = {}
    }

    currentTeams[workspaceId] = teamId
    localStorage.setItem('current-teams', JSON.stringify(currentTeams))
  }

  const setCurrentTeamFromLocalStorage = () => {
    let currentTeams
    try {
      currentTeams = JSON.parse(localStorage.getItem('current-teams') || '{}')
    } catch (e) {
      currentTeams = {}
    }

    if (currentWorkspace.value) {
      const storageCurrentTeam = currentTeams[currentWorkspace.value.id]
      if (storageCurrentTeam) setCurrentTeam({ workspaceId: currentWorkspace.value.id, teamId: storageCurrentTeam })
    }
  }

  return {
    currentTeam,
    setCurrentTeam,
    currentWorkspaceTeams,
    setCurrentTeamFromLocalStorage,
    getTeamFromIdea,
    draftTeam,
    createTeam,
    updateTeam,
    removeUserFromTeam,
    leaveTeam,
    disbandTeam,
    publicTeamsToJoin,
    totalIdeasInTeam,
    joinTeam,
    updateTeamUserRole,
    addMembersToTeam,
  }
}
