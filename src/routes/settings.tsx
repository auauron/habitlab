import { createFileRoute } from '@tanstack/react-router'
import SettingsView from '../features/habitlab/components/SettingsView'

export const Route = createFileRoute('/settings')({
  component: SettingsView,
})
