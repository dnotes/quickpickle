<style>
  .hidden { display:none; }
  .invisible { visibility:hidden; }

  .faq-item:has(input:checked) .faq-answer {
    display: block;
    max-height: 200px; /* Adjust this value based on your content */
    transition: max-height 0.5s ease-in;
  }
  .faq-toggle { cursor: pointer;}
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
  }
  .faq-item {
    cursor: pointer;
  }
  .faq-item input[type="checkbox"] {
    display: none;
  }
</style>

<header>
  <h1>HTML Test Page</h1>
  <nav>
    <ul>
      <li><a href="#text">Text</a></li>
      <li><a href="#lists">Lists</a></li>
      <li><a href="#table">Table</a></li>
      <li><a href="#form">Form</a></li>
      <li><a href="#faq">FAQ</a></li>
      <li><a href="#image">Image</a></li>
    </ul>
  </nav>
</header>

<main>
  <section id="text">
    <h2>Text Elements</h2>
    <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
    <p>Here's a <a href="https://www.example.com">link</a> to an example website.</p>
    <blockquote>This is a blockquote.</blockquote>
  </section>

  <section id="lists">
    <h2>Lists</h2>
    <h3>Unordered List</h3>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h3>Ordered List</h3>
    <ol>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
      <li class="hidden">Hidden item</li>
      <li class="invisible">Invisible item</li>
    </ol>
  </section>

  <section id="table">
    <h2>Table</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1, Cell 1</td>
          <td>Row 1, Cell 2</td>
        </tr>
        <tr>
          <td>Row 2, Cell 1</td>
          <td>Row 2, Cell 2</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section id="form">
    <h2>Form</h2>
    <form action="#" method="post">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required><br><br>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>

      <label for="message">Message:</label><br>
      <textarea id="message" name="message" rows="4" cols="50"></textarea><br><br>

      <label for="from">From:</label>
      <input type="text" id="from" name="from" disabled value="example@example.com"><br><br>

      <label for="date">Date:</label>
      <input type="date" id="date" name="date" value="2024-10-19"><br><br>

      <label for="number">Number:</label>
      <input type="number" id="number" name="number"><br><br>

      <label for="color">Color:</label>
      <select id="color" name="color">
        <option value="">- none -</option>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
      </select><br><br>

      <div>Send this message:</div>
      <input type="radio" name="sendtime" id="sendtime-now" value="now" checked>
      <label for="sendtime-now">Now</label>
      <input type="radio" name="sendtime" id="sendtime-later" value="later">
      <label for="sendtime-later">Later</label><br><br>

      <input type="checkbox" name="tnc" id="tnc">
      <label for="tnc">I agree to the terms and conditions</label><br><br>

      <input type="submit" value="Submit">
    </form>
  </section>

  <section id="faq">
    <h2>FAQ</h2>
    <div class="faq-item" id="faq-item-1">
      <label for="faq-1" class="faq-toggle">
        <input type="checkbox" id="faq-1" class="faq-toggle">
        <h3>Do CSS transitions affect Playwright awaits?</h3>
      </label>
      <p class="faq-answer">
        AI says: "CSS transitions can affect Playwright awaits if not handled properly.
        Playwright's default waiting mechanism might not account for CSS transitions,
        potentially leading to flaky tests. It's important to use appropriate waiting
        strategies or disable transitions in test environments to ensure consistency."
      </p>
    </div>
  </section>

  <section id="image">
    <h2>Image</h2>
    <img src="https://imgs.xkcd.com/comics/software_testing_day.png" alt="XKCD Comic 2928: Software Testing Day" width="320">
    <p>Image source: <a href="https://xkcd.com/2928">xkcd.com/2928</a></p>
  </section>
</main>

<footer>
  <p>© 2023 HTML Test Page. All rights reserved.</p>
</footer>
