import { PieChart, Pie, Label } from 'recharts';

const data = [
  { name: 'Group A', value: 400, fill: '#00afdc' },
  { name: 'Group B', value: 300, fill: '#2ad7eb' },
  { name: 'Group C', value: 300, fill: '#0d005d' },
];

const MyPie = () => (
  <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" innerRadius="60%" isAnimationActive={false} />
);

export default function PieChartInFlexbox() {
  return (
    <div className=' mt-8 '
      style={{
        margin: '',
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        minHeight: '300px',
        padding: '10px',
        justifyContent: 'space-around',
        alignItems: 'stretch',
      }}
    >
      <PieChart responsive style={{ height: 'calc(100% - 20px)', width: '33%', maxWidth: '300px', aspectRatio: 1 }}>
        <MyPie />
        <Label position="center" fill="#666">
            Equipe 1
        </Label>
      </PieChart>
      <PieChart responsive style={{ height: 'calc(100% - 20px)', width: '33%', maxWidth: '300px', aspectRatio: 1 }}>
        <MyPie />
        <Label position="center" fill="#666">
            Equipe 2
        </Label>
      </PieChart>
      <PieChart responsive style={{ height: 'calc(100% - 20px)', width: '33%', maxWidth: '300px', aspectRatio: 1 }}>
        <MyPie />
        <Label position="center" fill="#666">
            Equipe 3
        </Label>
      </PieChart>
    </div>
  );
}