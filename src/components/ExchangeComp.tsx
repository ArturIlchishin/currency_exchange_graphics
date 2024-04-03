import {useEffect, useState} from "react";
import {IChecked, ICurrency, IMoney} from "./types";
import {LineComponent} from "./LineComponent";



export const ExchangeComp = () => {
    const [firstDate, setFirstDate] = useState<string>('');
    const [lastDate, setLastDate] = useState<string>('');
    const [dates, setDates] = useState<string[]>([]);
    const [currentCurrency, setCurrentCurrency] = useState<string>('');
    //Состояние для проверки чекбоксов в виде объекта
    const [isChecked, setChecked] = useState<IChecked>({
        usd: false,
        eur: false,
        cny: false,
    });
    //Состояние для курсов валют в также представил в виде объекта с массивами данных
    const [money, setMoney] = useState<IMoney>({
        usd : [],
        eur : [],
        cny : [],
    })

    useEffect(() => {
        if(!isChecked.usd) {
            setMoney((prevState) => ({
                ...prevState,
                usd : []
            }) )
        }
        if(!isChecked.eur) {
            setMoney((prevState) => ({
                ...prevState,
                eur : []
            }) )
        }
        if(!isChecked.cny) {
            setMoney((prevState) => ({
                ...prevState,
                cny : []
            }) )
        }
    }, [isChecked, currentCurrency])

    useEffect(() => {formingDateColl(firstDate,lastDate)}, [lastDate, firstDate]);

    useEffect(() => {
        if(firstDate && lastDate && dates.length > 0) {
            getCurrencies(dates, currentCurrency);
        }
    }, [currentCurrency, dates, isChecked])

    //Функция отправки запросов на сервер
    async function getCurrencies (dates: string[], curr: string) {
        //Очищаем состояние с курсами валют при вызове ф-ии
        setMoney((prevState) => ({
            ...prevState,
            [curr] : []
        }));
        //Создаем массив промисов, чтобы после использовать его в Promise All
        const arrayFetchDates = dates.map((date) =>
            fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${curr}.json`)
                .then((response) => response.json()));
        //При выполнении условия, отправляем единовременно несколько запросов через Promise All
        //Нам важна последовательность, потому используем именно Promise All
        if(curr.length > 0  && isChecked[curr as keyof typeof isChecked]) {
        let resultData = await Promise.all(arrayFetchDates);
        //Создаем промежуточный массив, который после будем помещать в состояние.
        let result: ICurrency[] | undefined = [];
        for(let i = 0; i < resultData.length; i++) {
            result.push({
                'date': resultData[i].date,
                'currency': resultData[i][curr].rub,
            })
        }
        await setMoney((prevState) => ({
            ...prevState,
            [curr] : result
        }));
        }
    }
    //Функция, формирующая массив дат и сохраняющая его в состояние
    const formingDateColl = (firstDate: string, lastDate: string): void => {
        const firstDay =  Number(firstDate.slice(-2));
        const lastDay = Number(lastDate.slice(-2));
        let days: string[] = [];
        for (let i = firstDay; i <= lastDay; i++) {
            i < 10 ? days.push(`0${i}`) : days.push(`${i}`)
            }
        setDates(days.map((item) => `2024-03-${item}`));
    }

    return (
        <section className={'exchange__container'}>
            <form className={'form__container'}>
                <div className={'form__checkbox__wrap'}>
                    <label className={'form__checkbox__text'}>
                        <input className={'form__checkbox-input'} type={'checkbox'} onInput={() => {setCurrentCurrency('usd');
                            setChecked((prevState) => ({...prevState, usd: !prevState.usd}));
                        }}/>
                        USD
                    </label>
                    <label className={'form__checkbox__text'}>
                        <input className={'form__checkbox-input'} type={'checkbox'} onInput={() => {setCurrentCurrency('eur');
                            setChecked((prevState) => ({...prevState, eur: !prevState.eur}))}}/>
                        EUR
                    </label>
                    <label className={'form__checkbox__text'}>
                        <input className={'form__checkbox-input'} type={'checkbox'} onInput={() => {setCurrentCurrency('cny');
                            setChecked((prevState) => ({...prevState, cny: !prevState.cny}));
                        }}/>
                        CNY
                    </label>
                </div>

            <div className={'form__input__date'}>
                <div className={'form__input__date__first'}>
                    <label className={'form__input_date-text'}>First date
                        <input type={'date'} min={'2024-03-06'} max={'2024-03-28'}
                               onInput={(e) => setFirstDate(e.currentTarget.value)}/>
                    </label>
                </div>
                <div className={'form__input__date__last'}>
                    <label className={'form__input_date-text'}>Last date
                        <input type={'date'} min={firstDate} max={'2024-03-28'}
                               onInput={(e) => {
                                   setLastDate(e.currentTarget.value);
                               }}/>
                    </label>
                </div>
            </div>
            </form>
                <LineComponent arrayOfData={money} dates={dates} />
        </section>
    )
};