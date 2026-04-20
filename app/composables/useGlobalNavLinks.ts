import type { NavigationConfig, NavigationConfigWithGroups } from '~/types'

export function useGlobalNavLinks() {
  const discord = useDiscordLink()
  const { t: $t } = useI18n()

  const desktopLinks = computed<NavigationConfig>(() => [
    {
      name: 'Compare',
      label: $t('nav.compare'),
      to: { name: 'compare' },
      keyshortcut: 'c',
      type: 'link',
      external: false,
      iconClass: 'i-lucide:git-compare',
    },
    {
      name: 'Settings',
      label: $t('nav.settings'),
      to: { name: 'settings' },
      keyshortcut: ',',
      type: 'link',
      external: false,
      iconClass: 'i-lucide:settings',
    },
  ])

  const mobileLinks = computed<NavigationConfigWithGroups>(() => [
    {
      name: 'Desktop Links',
      type: 'group',
      items: [...desktopLinks.value],
    },
    {
      type: 'separator',
    },
    {
      name: 'About & Policies',
      type: 'group',
      items: [
        {
          name: 'About',
          label: $t('footer.about'),
          to: { name: 'about' },
          type: 'link',
          external: false,
          iconClass: 'i-lucide:info',
        },
        {
          name: 'Blog',
          label: $t('footer.blog'),
          to: { name: 'blog' },
          type: 'link',
          external: false,
          iconClass: 'i-lucide:notebook-pen',
        },
        {
          name: 'Privacy Policy',
          label: $t('privacy_policy.title'),
          to: { name: 'privacy' },
          type: 'link',
          external: false,
          iconClass: 'i-lucide:shield-check',
        },
        {
          name: 'Accessibility',
          label: $t('a11y.title'),
          to: { name: 'accessibility' },
          type: 'link',
          external: false,
          iconClass: 'i-custom:a11y',
        },
        {
          name: 'Translation Status',
          label: $t('translation_status.title'),
          to: { name: 'translation-status' },
          type: 'link',
          external: false,
          iconClass: 'i-lucide:languages',
        },
        {
          name: 'Brand',
          label: $t('footer.brand'),
          to: { name: 'brand' },
          type: 'link',
          external: false,
          iconClass: 'i-lucide:palette',
        },
      ],
    },
    {
      type: 'separator',
    },
    {
      name: 'External Links',
      type: 'group',
      label: $t('nav.links'),
      items: [
        {
          name: 'Source',
          label: $t('footer.source'),
          href: 'https://repo.npmx.dev',
          target: '_blank',
          type: 'link',
          external: true,
          iconClass: 'i-simple-icons:github',
        },
        {
          name: 'Social',
          label: $t('footer.social'),
          href: 'https://social.npmx.dev',
          target: '_blank',
          type: 'link',
          external: true,
          iconClass: 'i-simple-icons:bluesky',
        },
        {
          name: 'Chat',
          label: discord.value.label,
          href: discord.value.url,
          target: '_blank',
          type: 'link',
          external: true,
          iconClass: 'i-lucide:message-circle',
        },
      ],
    },
  ])

  return { desktopLinks, mobileLinks }
}
