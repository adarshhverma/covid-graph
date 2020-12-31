import { useState ,useEffect} from 'react';
import './App.css';
import Header from './components/Header';
import LineGraph from './components/LineGraph';
import Footer from './components/Footer'



const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};


function App() {

  const [casesType, setCasesType] = useState('cases');

  const [data, setData] = useState({});

  const [timestamp, setTimestamp] = useState('30')

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=${timestamp}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType, timestamp]);


  return (
    <div className="App">
      <Header />
      <div className='container mainbody'>
        
        <div className='mainPage'>
          <button className='btn btn-upper btn-outline-info' onClick={(e) => setTimestamp('3')}>Today</button>
          <button className='btn btn-upper btn-outline-info' onClick={(e) => setTimestamp('30')}>This Month</button>
          <button className='btn btn-upper btn-outline-info' onClick={(e) => setTimestamp('120')}>Last 4 Months</button>
          <LineGraph data={data} casesType={casesType}/>
          <p className='caseType btn btn-primary' onClick={(e) => setCasesType("cases")}>Cases</p>
          <p className='caseType btn btn-success' onClick={(e) => setCasesType("recovered")}>Recovered</p>
          <p className='caseType btn btn-danger' onClick={(e) => setCasesType("deaths")}>Deaths</p>
        </div>
      
      </div>
      <Footer />
    </div>
  );
}

export default App;
