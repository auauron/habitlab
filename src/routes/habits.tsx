import { createFileRoute } from '@tanstack/react-router'
import HabitsView from '../features/habitlab/components/HabitsView'

export const Route = createFileRoute('/habits')({
  component: HabitsView,
})
