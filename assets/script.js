const config = {
	markets: {
		name: 'Markets',
		items: {
			fan: {
				name: 'Fan tokens',
				value: 0
			},
			staking: {
				name: 'Staking',
				value: 0
			},
			btc: {
				name: 'BTC Pairs',
				value: 0
			},
			eth: {
				name: 'ETH Pairs',
				value: 0
			},
			cmc: {
				name: 'Top 10 cmc pairs',
				value: 0
			},
			gamefi: {
				name: 'GameFi tokens',
				value: 0
			},
			defi20: {
				name: 'Defi2.0 tokens',
				value: 0
			},
			socialfi: {
				name: 'SocialFi tokens',
				value: 0
			},
			meme: {
				name: 'Meme coins',
				value: 0
			},
			shit: {
				name: 'Shit coins',
				value: 0
			},
			x10: {
				name: 'Margin trading x10'
			},
			x20: {
				name: 'Margin trading x20'
			},
			x30: {
				name: 'Margin trading x30'
			},
			x50: {
				name: 'Margin trading x50'
			},
			derivatives: {
				name: 'Derivatives'
			},
			pmarkets: {
				name: 'Prediction markets'
			},
			web3: {
				name: 'Web3 integration'
			},
			dao: {
				name: 'DAO'
			}
		}
	},
	pr: {
		name: 'PR&Team',
		items: {
			support: {
				name: 'Support team',
				value: 0
			},
			hb: {
				name: 'HamsterBooks',
				value: 0
			},
			x: {
				name: 'X',
				value: 0
			},
			cointelegraph: {
				name: 'Cointelegraph',
				value: 0
			},
			ht: {
				name: 'HamsterTube',
				value: 0
			},
			hg: {
				name: 'HamsterGram',
				value: 0
			},
			tiktok: {
				name: 'TikTok',
				value: 0
			},
			coindesk: {
				name: 'Coindesk',
				value: 0
			},
			influencers: {
				name: 'Influencers',
				value: 0
			},
			ceo: {
				name: 'CEO',
				value: 0
			},
			it: {
				name: 'IT team',
				value: 0
			},
			marketing: {
				name: 'Marketing',
				value: 0
			},
			partnership: {
				name: 'Partnership program',
				value: 0
			},
			pt: {
				name: 'Product team',
				value: 0
			},
			bigdev: {
				name: 'BisDev team',
				value: 0
			}
		}
	},
	legal: {
		name: 'Legal',
		items: {
			kyc: {
				name: 'KYC',
				value: 0
			},
			kyb: {
				name: 'KYB',
				value: 0
			},
			legal: {
				name: 'Legal opinion',
				value: 0
			},
			sec: {
				name: 'SEC transparency',
				value: 0
			},
			aml: {
				name: 'Anti money loundering',
				value: 0
			},
			luae: {
				name: 'License UAE',
				value: 0
			},
			leu: {
				name: 'License Europe',
				value: 0
			},
			lasia: {
				name: 'License Asia',
				value: 0
			},
			lsa: {
				name: 'License South America',
				value: 0
			},
			lau: {
				name: 'License Australia',
				value: 0
			},
			lna: {
				name: 'License North America',
				value: 0
			}
		}
	},
	specials: {
		name: 'Specials',
		items: {
			/*t49: {
				name: 'Token2049',
				is_active: Date.now() / 1000 < 1713960000
			},*/
			tonusdt: {
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
			},
			bogdanoff: {
				name: 'Bogdanoff is calling',
			}
		}
	}
};

const formatter = Intl.NumberFormat('en', { notation: 'compact' });
const dump = document.querySelector('textarea[name="dump"]');

dump.value = localStorage.getItem('dump')?.length ? localStorage.getItem('dump') : '';

const boot = () => {
	const saved = dump.value.length ? JSON.parse(dump.value) : {};

	for(const key in config) {
		const $template = document.createElement('template');

		$template.innerHTML = `<div class="category" data-key><div class="name"></div><div class="items"></div></div>`;
		$template.content.querySelector('.category').dataset.key = key;
		$template.content.querySelector('.name').innerText = config[key].name;

		document.querySelector('.calculator .categories').append($template.content);

		const $items = document.querySelector(`.categories .category[data-key="${key}"] .items`);

		for(const k in config[key].items) {
			const i = config[key].items[k];

			const cost = key in saved && k in saved[key] ? saved[key][k][0] : 0;
			const profit = key in saved && k in saved[key] ? saved[key][k][1] : 0;

			$items.insertAdjacentHTML(
				'beforeend',
				`<div class="item" data-key="${k}">
                    <div class="name">${i.name}</div>
                    <div class="opinions">
						<div>
							<label>Upgrade cost</label>
							<input type="number" name="cost" value="${cost}" onkeyup="update();calculate()" onchange="update();calculate()" pattern="[0-9]*" inputmode="numeric" />
						</div>
						<div>
							<label>Profit/hour</label>
							<input type="number" name="profit" value="${profit}" onkeyup="update();calculate()" onchange="update();calculate()" pattern="[0-9]*" inputmode="numeric" />
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
			saved[element.dataset.key][el.dataset.key] = [
				Number(el.querySelector('[name="cost"]').value || 0), Number(el.querySelector('[name="profit"]').value || 0)
			];
		});
	});

	dump.value = JSON.stringify(saved);
	store();
};

const calculate = () => {
	let best;

	document.querySelectorAll('.calculator .categories .category').forEach((element) => {
		element.querySelectorAll('.items .item').forEach((el) => {
			const cost = Number(el.querySelector('[name="cost"]').value);
			const profit = Number(el.querySelector('[name="profit"]').value);

			if((!best || best.value < profit / cost) && cost > 0 && profit > 0) {
				best = {
					category: element.dataset.key,
					item: el.dataset.key,
					value: profit > 0 ? profit / cost : 0,
					cost, profit
				};
			}
		});
	});

	if(best) {
		document.querySelector('.results').innerText = `${config[best.category].items[best.item].name} in ${config[best.category].name} (${formatter.format(best.profit)} per hour for ${formatter.format(best.cost)})`;
		document.querySelector('.calculator .categories .category .items .item.best')?.classList?.remove('best');
		document.querySelector(`.calculator .categories .category[data-key="${best.category}"] .items .item[data-key="${best.item}"]`).classList.add('best');

		return;
	}

	document.querySelector('.results').innerText = `Fill data before start`;
};

const fill = () => {
	const saved = dump.value.length ? JSON.parse(dump.value) : {};

	document.querySelectorAll('.calculator .categories .category').forEach((element) => {
		element.querySelectorAll('.items .item').forEach((el) => {
			el.querySelector('[name="cost"]').value = element.dataset.key in saved && el.dataset.key in saved[element.dataset.key] ? saved[element.dataset.key][el.dataset.key][0] : 0;
			el.querySelector('[name="profit"]').value = element.dataset.key in saved && el.dataset.key in saved[element.dataset.key] ? saved[element.dataset.key][el.dataset.key][1] : 0;
		});
	});

	store();
	calculate();
}

const store = () => {
	if(!dump.value.length) {
		localStorage.removeItem('dump');
		return;
	}

	try {
		if(Object.prototype.toString.call(JSON.parse(dump.value)) === '[object Object]') {
			localStorage.setItem('dump', dump.value);
		}
	}
	catch(e) {
		console.error(e.message);
	}
}

document.addEventListener('DOMContentLoaded', boot);