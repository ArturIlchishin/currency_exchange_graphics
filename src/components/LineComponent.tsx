import {Line} from 'react-chartjs-2';
import {IPropsForLineComp as IProps} from "./types";
import {Chart as ChartJS, CategoryScale} from "chart.js/auto";

export const LineComponent = ({ arrayOfData, dates }: IProps) => {
    ChartJS.register(CategoryScale);

    let graphicData =
        {
            //ВОТ ТЫ ГДЕ СУКА
            labels: dates.map((item) => item),
            datasets: [
                {
                    label: "USD",
                    data: arrayOfData.usd.map((item) => item.currency),
                    backgroundColor: [
                        "rgb(47,147,95)",
                    ],
                    borderColor: "rgb(47,147,95)",
                },
                {
                    label: "EUR",
                    data: arrayOfData.eur.map((item) => item.currency),
                    backgroundColor: [
                        "rgb(103,165,246)",
                    ],
                    borderColor: "rgb(103,165,246)",
                },
                {
                    label: "CNY",
                    data: arrayOfData.cny.map((item) => item.currency),
                    backgroundColor: [
                        "rgb(155,0,0)",
                    ],
                    borderColor: "rgb(155,0,0)",
                },
            ],
        };


    return (
        <div className={'graphics__container'}>
            <Line data={graphicData} />
        </div>
    )
}