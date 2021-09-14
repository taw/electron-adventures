<script>
  import path from "path-browserify"
  import File from "./File.svelte"
  import { getContext, tick } from "svelte"

  export let initialDirectory
  export let id

  let directory = initialDirectory
  let initialFocus
  let initialSelected = []
  let files = []
  let selected = []
  let focusedIdx = 0
  let fileNodes = []
  let fileListNode
  let filesPromise

  let {eventBus, activePanel} = getContext("app")
  let app = eventBus.target("app")

  $: active = ($activePanel === id)
  $: fetchFiles(directory)
  $: filesCount = files.length
  $: focused = files[focusedIdx]
  $: focusedPath = focused && path.join(directory, focused.name)
  $: header = (directory === "/") ? "/" : path.basename(directory)

  function flipSelected(idx) {
    if (files[idx].name === "..") {
      return
    }
    if (selected.includes(idx)) {
      selected = selected.filter(f => f !== idx)
    } else {
      selected = [...selected, idx]
    }
  }
  async function fetchFiles() {
    try {
      files = await window.api.directoryContents(directory)
      setInitialSelected()
      setInitialFocus()
    } catch (err) {
      console.log(err)
      if (directory === "/") {
        files = []
      } else {
        initialFocus = path.basename(directory)
        directory = path.join(directory, "..")
      }
    }
  }
  async function setInitialFocus() {
    focusedIdx = 0
    if (initialFocus) {
      focusedIdx = files.findIndex(x => x.name === initialFocus)
      if (focusedIdx === -1) {
        focusedIdx = 0
      }
    } else {
      focusedIdx = 0
    }
    await tick()
    scrollFocusedIntoView()
  }
  function setInitialSelected() {
    selected = []
    files.forEach((file, idx) => {
      if (initialSelected.includes(file.name)) {
        selected.push(idx)
      }
    })
    initialSelected = []
  }
  async function scrollFocusedIntoView() {
    if (fileNodes[focusedIdx]) {
      fileNodes[focusedIdx].scrollIntoViewIfNeeded(true)
    }
  }
  function focusOn(idx) {
    focusedIdx = idx
    if (focusedIdx > filesCount - 1) {
      focusedIdx = filesCount - 1
    }
    if (focusedIdx < 0) {
      focusedIdx = 0
    }
    scrollFocusedIntoView()
  }
  function pageSize() {
    if (!fileNodes[0] || !fileNodes[1] || !fileListNode) {
      return 16
    }
    let y0 = fileNodes[0].getBoundingClientRect().y
    let y1 = fileNodes[1].getBoundingClientRect().y
    let yh = fileListNode.getBoundingClientRect().height
    return Math.floor(yh / (y1 - y0))
  }
  function activateItem() {
    if (focused?.type === "directory") {
      if (focused.name === "..") {
        initialFocus = path.basename(directory)
      } else {
        initialFocus = null
      }
      directory = path.join(directory, focused.name)
    }
  }
  function nextItem() {
    focusOn(focusedIdx + 1)
  }
  function previousItem() {
    focusOn(focusedIdx - 1)
  }
  function pageDown() {
    focusOn(focusedIdx + pageSize())
  }
  function pageUp() {
    focusOn(focusedIdx - pageSize())
  }
  function firstItem() {
    focusOn(0)
  }
  function lastItem() {
    focusOn(filesCount - 1)
  }
  function flipItem() {
    flipSelected(focusedIdx)
    nextItem()
  }
  function viewFocusedFile() {
    if (focused?.type === "directory") {
      activateItem()
    } else {
      app.viewFile(focusedPath)
    }
  }
  function editFocusedFile() {
    if (focused?.name === "..") {
      return
    } else {
      app.editFile(focusedPath)
    }
  }
  function createDirectory() {
    app.openDialog("MkdirDialog", {base: directory})
  }
  function deleteFiles() {
    let filesTodo
    if (selected.length) {
      filesTodo = selected.map(idx => files[idx].name)
    } else if (focused && focused.name !== "..") {
      filesTodo = [focused.name]
    } else {
      return
    }
    app.openDialog("DeleteDialog", {base: directory, files: filesTodo})
  }
  function refresh() {
    initialFocus = focused?.name
    initialSelected = selected.map(i => files[i].name)
    filesPromise = window.api.directoryContents(directory)
  }
  eventBus.handle(id, {nextItem, previousItem, pageDown, pageUp, firstItem, lastItem, flipItem, activateItem, focusOn, flipSelected, activateItem, viewFocusedFile, editFocusedFile, createDirectory, refresh, deleteFiles})
</script>

<div class="panel {id}" class:active={active}>
  <header>{header}</header>
  <div class="file-list" bind:this={fileListNode}>
    {#each files as file, idx}
      <File
        panelId={id}
        file={file}
        idx={idx}
        focused={idx === focusedIdx}
        selected={selected.includes(idx)}
        bind:node={fileNodes[idx]}
      />
    {/each}
  </div>
</div>

<style>
  .left {
    grid-area: panel-left;
  }
  .right {
    grid-area: panel-right;
  }
  .panel {
    background: #338;
    margin: 4px;
    display: flex;
    flex-direction: column;
  }
  header {
    text-align: center;
    font-weight: bold;
  }
  .file-list {
    flex: 1;
    overflow-y: scroll;
  }
</style>
