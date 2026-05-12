import { createFileRoute } from '@tanstack/react-router'
import InsightsView from '../features/habitlab/components/InsightsView'

export const Route = createFileRoute('/insights')({
  component: InsightsView,
})
