const config = {
	markets: {
		name: 'Markets',
		items: [
			{
				name: 'Fan tokens',
				value: 0
			},
			{
				name: 'BTC Pairs',
				value: 0
			},
			{
				name: 'ETH Pairs',
				value: 0
			},
			{
				name: 'Top 10 cmc pairs',
				value: 0
			},
			{
				name: 'GameFi tokens',
				value: 0
			},
			{
				name: 'Defi2.0 tokens',
				value: 0
			},
			{
				name: 'SocialFi tokens',
				value: 0
			},
			{
				name: 'Meme coins',
				value: 0
			},
			{
				name: 'Shit coins',
				value: 0
			}
		]
	},
	pr: {
		name: 'PR&Team',
		items: [
			{
				name: 'Support team',
				value: 0
			},
			{
				name: 'HamsterBooks',
				value: 0
			},
			{
				name: 'X',
				value: 0
			},
			{
				name: 'Cointelegraph',
				value: 0
			},
			{
				name: 'HamsterTube',
				value: 0
			},
			{
				name: 'HamsterGram',
				value: 0
			},
			{
				name: 'TikTok',
				value: 0
			},
			{
				name: 'Coindesk',
				value: 0
			},
			{
				name: 'Influencers',
				value: 0
			},
			{
				name: 'CEO',
				value: 0
			},
			{
				name: 'IT team',
				value: 0
			},
			{
				name: 'Marketing',
				value: 0
			},
			{
				name: 'Partnership program',
				value: 0
			},
			{
				name: 'Product team',
				value: 0
			},
			{
				name: 'BigDev team',
				value: 0
			}
		]
	},
	legal: {
		name: 'Legal',
		items: [
			{
				name: 'KYC',
				value: 0
			},
			{
				name: 'KYB',
				value: 0
			},
			{
				name: 'Legal opinion',
				value: 0
			},
			{
				name: 'SEC transparency',
				value: 0
			},
			{
				name: 'Anti money loundering',
				value: 0
			},
			{
				name: 'License UAE',
				value: 0
			},
			{
				name: 'License Europe',
				value: 0
			},
			{
				name: 'License Asia',
				value: 0
			},
			{
				name: 'License South America',
				value: 0
			},
			{
				name: 'License Australia',
				value: 0
			},
			{
				name: 'License North America',
				value: 0
			},
		]
	},
	specials: {
		name: 'Specials',
		items: [
			{
				name: 'Token2049',
				is_active: Date.now() / 1000 < 1713960000
			},
			{
				name: 'USDT on TON',
				config: {
					start: {
						cost: 10000,
						profit: 1350
					},
					modifier: {
						cost: 0,
						profit: 6.99
					}
				}
			}
		]
	}
};

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

/*const template = {
	category: document.createElement('template'),
	item: document.createElement('template')
};

template.category.innerHTML = `<div class="category" data-key><div class="name"></div><div class="items"></div></div>`;
template.item.innerHTML = `<div class="item" data-key><div class="name"></div><div class="value"></div><div class="level"><input type="number" value /></div></div>`;*/

const dump = document.querySelector('textarea[name="dump"]');
dump.value = localStorage.getItem('dump')?.length ? localStorage.getItem('dump') : '';

const boot = () => {
	//const saved = localStorage.getItem('config')?.length ? JSON.parse(localStorage.getItem('config')) : {};
	const saved = dump.value.length ? JSON.parse(dump.value) : {};

	for(const key in config) {
		const template = document.createElement('template');

		template.innerHTML = `<div class="category" data-key><div class="name"></div><div class="items"></div></div>`;
		template.content.querySelector('.category').dataset.key = key;
		template.content.querySelector('.name').innerText = config[key].name;

		document.querySelector('.calculator .categories').append(template.content);

		for(const k in config[key].items) {
			const i = config[key].items[k];

			if('is_active' in i && !i.is_active) {
				continue;
			}

			const cost = key in saved && k in saved[key] ? saved[key][k][0] : 0;
			const profit = key in saved && k in saved[key] ? saved[key][k][1] : 0;

			document.querySelector(`.categories .category[data-key="${key}"] .items`).insertAdjacentHTML(
				'beforeend',
				`<div class="item" data-key="${k}">
                    <div class="name">${i.name}</div>
                    <div class="opinions">
						<div>
							<label>Cost</label>
							<input type="number" name="cost" value="${cost}" onchange="update();calculate()" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\\..*)\\./g, '$1');" />
						</div>
						<div>
							<label>Profit per hour</label>
							<input type="number" name="profit" value="${profit}" onchange="update();calculate()" oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\\..*)\\./g, '$1');" />
						</div>
					</div>
                </div>`
			);
		}
	}

	calculate();
};

const update = () => {
	const saved = {};

	document.querySelectorAll('.calculator .categories .category').forEach((element) => {
		saved[element.dataset.key] = {};

		element.querySelectorAll('.items .item').forEach((el) => {
			//const count = Number(el.querySelector('.level input').value);
			const key = Number(el.dataset.key);
			const cost = Number(el.querySelector('[name="cost"]').value);
			const profit = Number(el.querySelector('[name="profit"]').value);

			saved[element.dataset.key][key] = [cost, profit];

			/*el.querySelector('.value').innerHTML = String(
				//count * config[element.dataset.key].items[Number(el.dataset.key)]
			);*/
		});
	});

	//localStorage.setItem('saved', JSON.stringify(saved));
	dump.value = JSON.stringify(saved);
	localStorage.setItem('dump', dump.value);
};

const calculate = () => {
	let best;

	document.querySelectorAll('.calculator .categories .category').forEach((element) => {
		element.querySelectorAll('.items .item').forEach((el) => {
			const cost = Number(el.querySelector('[name="cost"]').value);
			const profit = Number(el.querySelector('[name="profit"]').value);

			if(!best || best.value < profit / cost) {
				best = {
					category: config[element.dataset.key].name,
					item: config[element.dataset.key].items[el.dataset.key].name,
					value: profit > 0 ? profit / cost : 0,
					cost, profit
				};
			}
		});
	});

	document.querySelector('.results').innerText = best.cost > 0 ? `Best choice - ${best.item} in ${best.category} (${formatter.format(best.profit)} per hour for ${formatter.format(best.cost)})` : `Best choice - ${best.item} in ${best.category}`;
};

const fill = () => {
	const saved = dump.value.length ? JSON.parse(dump.value) : {};

	document.querySelectorAll('.calculator .categories .category').forEach((element) => {
		element.querySelectorAll('.items .item').forEach((el) => {
			el.querySelector('[name="cost"]').value = element.dataset.key in saved && el.dataset.key in saved[element.dataset.key] ? saved[element.dataset.key][el.dataset.key][0] : 0;
			el.querySelector('[name="profit"]').value = element.dataset.key in saved && el.dataset.key in saved[element.dataset.key] ? saved[element.dataset.key][el.dataset.key][1] : 0;
		});
	});

	calculate();
}

document.addEventListener('DOMContentLoaded', boot);