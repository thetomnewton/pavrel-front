interface StatusCategory {
  name: string
}

const categories: StatusCategory[] = [
  { name: 'removed' },
  { name: 'maybe' },
  { name: 'new' },
  { name: 'planning' },
  { name: 'ready' },
  { name: 'in_progress' },
  { name: 'done' },
]

export { categories }
