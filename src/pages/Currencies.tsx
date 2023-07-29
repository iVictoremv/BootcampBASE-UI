import { IconCoin } from "@tabler/icons-react";

//What I did
//TODO Renderizar arreglo de currencies
//TODO Crear condicion en caso de que no haya datos
//TODO Hacer el ordenado
//TODO Crear handleDropdown para ordenar
//TODO Crear handleSearch filtrar el arreglo

import { Currency, DropdownOrderBy, Header, SearchInput } from "../components";
import { useEffect, useState } from "react";
import { Currency as ICurrency } from "../interfaces"
import { currenciesMock } from "../mocks";

export const Currencies = () => {
	const [currencies, setCurrencies] = useState<ICurrency[]>([]);
	const [currentOrderOption, setCurrentOrderOption] = useState<string>("name");
	const orderOptionsCurrencies: { label: string; value: string }[] = [
		{ label: "Nombre", value: "name", },
		{ label: "Cambio", value: "symbol", },
		{ label: "Valor", value: "value", },
	];

	useEffect(() => {
		setCurrencies(currenciesMock);
		setCurrencies((prevState) => orderCurrency(prevState, currentOrderOption));
	}, []);

	const orderCurrency = (clients: ICurrency[], currenOrderOption: string,): ICurrency[] => {
		const key = currenOrderOption as keyof (typeof clients)[0];
		const newCurrency: ICurrency[] = clients.sort((a: ICurrency, b: ICurrency) => {
            if (a[key] > b[key]) return 1;
            if (a[key] < b[key]) return -1;
            return 0;
        });
        return newCurrency;
    };

	const handleDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentOrderOption(e.target.value);
		setCurrencies(orderCurrency(currencies, e.target.value));
	};

	const handleSearch = (searchWord: string) => {
		if (searchWord === "") {
			setCurrencies(orderCurrency(currenciesMock, currentOrderOption));
		} else {
			const newCurrencies = currencies.filter(currency => {
				return (currency.name.toLowerCase().includes(searchWord.toLowerCase())
					|| currency.symbol.toLowerCase().includes(searchWord.toLowerCase())
					|| currency.value.toString().toLowerCase().includes(searchWord.toLowerCase())
				)
			})
			setCurrencies(newCurrencies);
		}
	};
	
	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Divisas
				</h1>
				<div className="flex w-full gap-2 sm:w-96">
					<DropdownOrderBy
						onChange={handleDropdown}
						options={orderOptionsCurrencies}
						value={currentOrderOption}
					/>
					<SearchInput
						Icon={IconCoin}
						onSearch={(e) => handleSearch(e.target.value)}
						propertie="divisa"
					/>
				</div>
			</Header>

			<section className="flex flex-col items-center h-[calc(100vh-10rem)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<ul
					role="list"
					className="grid w-full gap-3 overflow-auto divide-y divide-gray-100 sm:grid-cols-2 xl:grid-cols-4 my-7"
				>
					{ 

						currencies.length === 0 ? (<div className="flex flex-col items-center justify-center h-full">
						<p className="text-3xl font-bold text-center">
							Anda pa llá boludo no funciona
						</p>
						<p className="mt-5 text-lg text-center">
							Algo fallo
						</p>
						</div>) : 
						(currencies.map((currency, index)=>{
								return <Currency currency={currency} key={index}/>;
							}))
					}
				</ul>
			</section>
		</>
	);
};
