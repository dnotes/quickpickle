<script lang="ts">
  import { remove } from "lodash-es";

  // Exported value
  export let value = '';

  // Internal representation of the data table as a 2D array
  let data: string[][] = [['','']]; // Start with two cells

  // Function to update the value string whenever data changes
  function updateValue() {
    // Convert the data array to a Cucumber data table string
    value = data.map(row => '| ' + row.join(' | ') + ' |').join('\n');
  }

  // Watch for changes in data and update value
  $: updateValue();

  // Function to add a new row
  function addRow() {
    data = [...data, Array(data[0].length).fill('')];
  }

  // Function to add a new column
  function addColumn() {
    data = data.map(row => [...row, '']);
  }

  // Function to handle cell input
  function handleInput(rowIndex: number, colIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    data[rowIndex][colIndex] = input.value;
  }

  // Function to handle keydown event for tabbing out of the last cell
  function handleKeydown(rowIndex: number, colIndex: number, event: KeyboardEvent) {
    if (event.key === 'Tab' && !event.shiftKey) {
      const isLastCell = rowIndex === data.length -1 && colIndex === data[0].length -1;
      if (isLastCell) {
        addRow();
        // Allow time for the new row to render before focusing
        setTimeout(() => {
          const nextRow = rowIndex +1;
          const nextCol = 0;
          const nextInput = document.getElementById(`cell-${nextRow}-${nextCol}`) as HTMLInputElement;
          if (nextInput) nextInput.focus();
        }, 0);
      }
    }
  }

  // Function to remove a row
  function removeRow(index: number) {
    if (data.length > 1) {
      data = data.slice(0, index).concat(data.slice(index + 1));
    }
  }

  // Function to remove a column
  function removeColumn(index: number) {
    if (data[0].length > 1) {
      data = data.map(row => row.slice(0, index).concat(row.slice(index + 1)));
    }
  }
</script>

<div>
  <table>
    <tbody>
      <tr>
        {#each data[0] as cell, colIndex}
          <td>
            <button class="remove-button" on:click={() => removeColumn(colIndex)} title="Remove Column">&times; delete row</button>
          </td>
        {/each}
        <td>
          <button class="add-button" on:click={addColumn}>+ Col</button>
        </td>
      </tr>
      {#each data as row, rowIndex}
        <tr>
          {#each row as cell, colIndex}
            <td>
              <input
                id={`cell-${rowIndex}-${colIndex}`}
                type="text"
                bind:value={data[rowIndex][colIndex]}
                on:input={(event) => handleInput(rowIndex, colIndex, event)}
                on:keydown={(event) => handleKeydown(rowIndex, colIndex, event)}
              />
            </td>
          {/each}
          <td>
            <button class="remove-button" on:click={() => removeRow(rowIndex)} title="Remove Row">&times;</button>
          </td>
        </tr>
      {/each}
      <tr>
        <td colspan="{data[0].length + 1}">
          <button class="add-button" on:click={addRow}>+ Row</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  td, th {
    border: 1px solid #ccc;
    padding: 4px;
    text-align: left;
  }
  input {
    width: 100%;
    box-sizing: border-box;
    padding: 4px;
  }
  .remove-button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--quickpickle-danger-color);
    font-size: 12px;
  }
  .add-button {
    padding: 4px 8px;
  }
</style>
