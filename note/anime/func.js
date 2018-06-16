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
		let month = Number.parseInt(date[1], 10);

		if (animes_by_year.has(year)) {
			animes_by_year.get(year).push([anime, month]);
		} else {
			animes_by_year.set(year, [[anime, month]]);
		}
	}

	let nodes = build_tree(document, animes_by_year);
	append_nicely(document, nodes);
}

function build_tree(document, animes_by_year) {
	let sections = [];

	// use importNode in future
	for (let [year, animes] of animes_by_year) {
		let section = document.createElement("section");
		let h2 = document.createElement("h2");

		h2.textContent = `${year}年`;
		section.appendChild(h2);

		CREATE_TABLE: {
			let table = document.createElement("table");

			for (let [anime, month] of animes) {
				let tr = document.createElement("tr");

				let td1 = document.createElement("td");
				td1.textContent = anime[1];
				tr.appendChild(td1);

				let td2 = document.createElement("td");
				td2.textContent = season(month);
				tr.appendChild(td2);

				table.appendChild(tr);
			}

			section.appendChild(table);
		}

		sections.push(section);
	}

	return sections;
}

function season(month) {
	/*
		1 ~ 3 = winter
		4 ~ 6 = spring
		7 ~ 9 = summer
		10 ~ 12 = autumn
	*/
	if (month > 9) {
		return "\uD83C\uDF41"; // autumn
	} else if (month > 6) {
		return "\uD83C\uDF3B"; // summer
	} else if (month > 3) {
		return "\uD83C\uDF38"; // spring
	} else {
		return "\u2744\uFE0F"; // winter
	}
}

function append_nicely(document, sections) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
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
