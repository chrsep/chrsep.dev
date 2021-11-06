<script lang="ts">
	let className: string;

	export { className as class };
</script>

<div role="img" aria-hidden="true" class="w-5 h-5 bg-white icon {className}" />

<style>
	.icon {
		mask-image: var(--icon-src);
		mask-size: 100%;
		mask-repeat: no-repeat;
	}
</style>
