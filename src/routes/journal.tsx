import { createFileRoute } from '@tanstack/react-router'
import JournalView from '../features/habitlab/components/JournalView'

export const Route = createFileRoute('/journal')({
  component: JournalView,
})
