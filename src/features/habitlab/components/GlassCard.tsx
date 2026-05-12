import type { ComponentPropsWithoutRef } from 'react'

type GlassCardProps = ComponentPropsWithoutRef<'section'> & {
  tone?: 'default' | 'strong' | 'blue'
}

export default function GlassCard({
  className = '',
  tone = 'default',
  ...props
}: GlassCardProps) {
  return (
    <section
      className={`glass-card glass-card-${tone} ${className}`}
      {...props}
    />
  )
}
