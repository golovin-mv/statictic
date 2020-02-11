<script>
  import Icon from "./Icon.svelte";
  import { Router, Link } from "svelte-routing";
</script>

<style>
  .side-menu {
    grid-area: nv;
    background-color: var(--menu-background);
    color: var(--menu-color);
  }

  .side-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .side-menu li {
    cursor: pointer;
    padding: 1em;
    font-size: 1.2em;
    display: flex;
    align-items: center;
  }

  .side-menu li:hover {
    background-color: var(--active);
  }

  .side-menu .icon {
    margin-right: 1em;
    font-size: 1.5em;
    color: var(--side-menu-icon-color);
  }
</style>

<Router>
  <nav class="side-menu">
    <ul>
      <Link to="/jobs">
        <li>
          <span class="icon">
            <Icon class="icon" name="lightbulb" />
          </span>
          Jobs
        </li>
      </Link>
    </ul>
  </nav>
</Router>
