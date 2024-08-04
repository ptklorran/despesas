import React from 'react';
import { Row, Col, Card } from 'antd';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ChartComponent from './Chart';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface DashboardProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, setExpenses }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24} lg={8} style={{ padding: '20px' }}>
        <Card title="Veja as despesas por categoria" style={{ 'color': '#f2f2f2' }} className='chart'>
          <ChartComponent expenses={expenses} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} style={{ padding: '20px' }}>
        <Card title="Adicione uma despesa">
          <ExpenseForm setExpenses={setExpenses} />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} style={{ padding: '20px' }}>
        <Card title="Veja suas Despesas">
          <ExpenseList expenses={expenses} setExpenses={setExpenses} />
        </Card>
      </Col>
      
    </Row>
  );
};

export default Dashboard;
