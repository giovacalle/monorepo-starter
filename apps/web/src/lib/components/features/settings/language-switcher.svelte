<script lang="ts">
	import { Select } from '@monorepo-starter/ui';
	import { setLocale, getLocale, locales } from '$lib/paraglide/runtime';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages';
</script>

<Select.Root
	type="single"
	onValueChange={(v: string) => {
		setLocale(v as keyof typeof locales.keys);
	}}
	items={locales.map((l) => ({ label: l, value: l }))}>
	<Select.Trigger class="hover:bg-muted fixed bottom-4 left-4 z-50 rounded-full p-2">
		<Icon icon={`circle-flags:${getLocale()}`} width={20} height={20} />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content side="top" align="end">
			<Select.Viewport>
				{#each locales as l}
					<Select.Item class="gap-2 p-1" value={l} label={l}>
						{#snippet children()}
							<Icon icon={`circle-flags:${l}`} class="shrink-0" />
							<span>{m[`common.locales.${l}`]()}</span>
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
