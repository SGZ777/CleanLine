import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  {
    name: 'Vendas',
    Equipe1: 9,
    Equipe2: 2,
    Equipe3: 2,
  },
  {
    name: 'RH',
    Equipe1: 9,
    Equipe2: 9,
    Equipe3: 9,
  },
  {
    name: 'TI',
    Equipe1: 9,
    Equipe2: 9,
    Equipe3: 9,
  },
  {
    name: 'Financeiro',
    Equipe1: 9,
    Equipe2: 9,
    Equipe3: 9,
  },
  {
    name: 'Diretoria',
    Equipe1: 9,
    Equipe2: 9,
    Equipe3: 9,
  },
  {
    name: 'Produção A',
    Equipe1: 9,
    Equipe2: 9,
    Equipe3: 9,
  },
  {
    name: 'Produção B',
    Equipe1: 9,
    Equipe2: 9,
    Equipe3: 9,
  },
  {
    name: 'Produção C',
    Equipe1: 9,
    Equipe2: 9,
    Equipe3: 9,
  },
  {
    name: 'Marketing',
    Equipe1: 9,
    Equipe2: 9,
    Equipe3: 9,
  },
];

const SimpleBarChart = () => {
  return (
    <BarChart
      style={{ width: '100%', maxWidth: '1000px', maxHeight: '55vh', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
      <Tooltip />
      <Legend />
      <Bar dataKey="Equipe1" fill="#00afdc" radius={[5, 5, 0, 0]} />
      <Bar dataKey="Equipe2" fill="#2ad7eb" radius={[5, 5, 0, 0]} />
      <Bar dataKey="Equipe3" fill="#0d005d" radius={[5, 5, 0, 0]} />
    </BarChart>
  );
};

export default SimpleBarChart;