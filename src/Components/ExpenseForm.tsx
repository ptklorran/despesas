import React from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Select } from 'antd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface ExpenseFormProps {
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ setExpenses }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const newExpense = {
      id: uuidv4(),
      date: values.date.format('YYYY-MM-DD'),
      description: values.description,
      category: values.category,
      amount: values.amount
    };

    axios.post('http://localhost:4000/expenses', newExpense)
      .then(response => {
        setExpenses(prevExpenses => [...prevExpenses, response.data]);
        form.resetFields();
      })
      .catch(error => {
        console.error('Erro ao adicionar despesa:', error);
      });
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="date" label="Data de pagamento" rules={[{ required: true, message: 'Informe a data de entrada!' }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item name="description" label="Descrição" rules={[{ required: true, message: 'Informe uma descrição!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="category" label="Categoria" rules={[{ required: true, message: 'Selecione uma categoria!' }]}>
        <Select>
          <Select.Option value="casa">Casa</Select.Option>
          <Select.Option value="locomoção">Locomoção</Select.Option>
          <Select.Option value="lazer">Lazer</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="amount" label="Valor" rules={[{ required: true, message: 'Informe o valor da despesa!' }]}>
        <InputNumber<number>
          defaultValue={1000}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Adicionar Despesa
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ExpenseForm;
