export default function (document, animes) {
  // date desc
  animes.sort((a, b) => {
    return a[0] > b[0] ? -1 : 1;
  });

  let animes_by_year = new Map();

  // group by year
  for (let anime of animes) {
    // skip a watching or unfinished one
    if (anime.length > 2) { continue; }

    let date = anime[0].split("-");
    let year = Number.parseInt(date[0], 10);
    //let month = Number.parseInt(date[1], 10);

    if (animes_by_year.has(year)) {
      animes_by_year.get(year).push(anime);
    } else {
      animes_by_year.set(year, [anime]);
    }
  }

  let nodes = build_tree(document, animes_by_year);

  nice_append(document, nodes);
}

function build_tree(document, animes_by_year) {
  let sections = [];

  for (let [year, animes] of animes_by_year) {
    let section = document.createElement("section");
    let h2 = document.createElement("h2");

    h2.textContent = `${year}年`;
    section.appendChild(h2);

    COMPOSE: {
      let ul = document.createElement("ul");

      for (let anime of animes) {
        let li = document.createElement("li");
        li.textContent = anime[1];
        ul.appendChild(li);
      }

      section.appendChild(ul);
    }

    sections.push(section);
  }

  return sections;
}

function nice_append(document, sections) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sections => {
      let node = document.querySelector("main");
      for (let section of sections) {
        node.appendChild(section);
      }
    });
  } else {
    let node = document.querySelector("main");
    for (let section of sections) {
      node.appendChild(section);
    }
  }
}
