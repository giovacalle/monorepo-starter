<script lang="ts">
	import { Select } from 'bits-ui';
	import { setLocale, getLocale, locales } from '$lib/paraglide/runtime';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<Select.Root
	type="single"
	onValueChange={v => {
		setLocale(v as keyof typeof locales.keys);
	}}
	items={locales.map(l => ({ label: l, value: l }))}>
	<Select.Trigger class="rounded-full hover:bg-muted p-2">
		<Icon icon={`circle-flags:${getLocale()}`} width={20} height={20} />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 h-auto max-h-[var(--bits-select-content-available-height)] select-none rounded-lg border p-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
			align="end">
			<Select.Viewport>
				{#each locales as l}
					<Select.Item
						class="rounded-button data-highlighted:bg-muted outline-hidden w-full select-none p-1 flex items-center gap-2"
						value={l}
						label={l}>
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
