<script>
	import Header from './components/Header.svelte';
	import Content from './components/Content.svelte';
	import Footer from './components/Footer.svelte';
	import SideMenu from './components/SideMenu.svelte'

	import 'normalize.css';
	import 'dripicons/webfont/webfont.css';
</script>

<style>
	:global(:root) {
		/* colors */
		--header-background: #16a085;
		--sub-header-background: #2c3e50;
		--menu-background:#2c3e50;
		--menu-color: #bdc3c7;
		--footer-background: #bdc3c7;
		--content-background: #34495e;
		--content-color: #ecf0f1;
		--sub-content-color: #bdc3c7;
		--border-color: #bdc3c7;
		--tag-background: #e67e22;
		--warning-color: #d35400;
		--card-background: #1f587d;
		--active: #3498db;
		--side-menu-icon-color: #f39c12;
		/* size */
		--header-heigth: 6em;
	}

	.root {
		height: 100%;
		display: grid;
		grid-template-rows: auto 10fr 1fr;
  	grid-template-columns: 2fr 5fr 5fr;
		grid-template-areas: "hd hd hd"
												 "nv mn mn"
												 "nv mn mn"
	}
</style>


<section class="root">
	<Header/>
	<SideMenu/>
	<Content/>
	<Footer/>
</section>