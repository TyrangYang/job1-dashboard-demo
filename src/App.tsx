import './App.css';
import Chart from './components/Chart';
import Table from './components/Table';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
} from 'chart.js';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { RowGroupingModule } from 'ag-grid-enterprise';
import BarChart from './components/BarChart';
import FilterList from './components/FilterList';
import { useDataContext } from './context/DataProvider';

ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule]);

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  Tooltip,
  Legend
);

function App() {
  const { data } = useDataContext();
  return (
    <div className="App">
      <FilterList></FilterList>
      <div style={{ height: 400 }}>
        <Table data={data} />
      </div>
      <div style={{ height: 300, display: 'flex' }}>
        <BarChart data={data} />
        <Chart data={data} />
      </div>
    </div>
  );
}

export default App;
