import React from 'react';
import { List, Button, Modal, Form, Input, InputNumber, DatePicker, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface ExpenseListProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, setExpenses }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [form] = Form.useForm();

  const removeExpense = (id: string) => {
    axios.delete(`http://localhost:4000/expenses/${id}`)
      .then(() => {
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
      })
      .catch(error => {
        console.error('Error removing expense:', error);
      });
  };

  const showEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    form.setFieldsValue({
      date: moment(expense.date),
      description: expense.description,
      category: expense.category,
      amount: expense.amount
    });
    setIsModalVisible(true);
  };

  const handleEdit = (values: any) => {
    const updatedExpense = {
      ...editingExpense,
      date: values.date.format('YYYY-MM-DD'),
      description: values.description,
      category: values.category,
      amount: values.amount
    };

    axios.put(`http://localhost:4000/expenses/${updatedExpense.id}`, updatedExpense)
      .then(response => {
        setExpenses(prevExpenses => prevExpenses.map(expense => expense.id === updatedExpense.id ? response.data : expense));
        setIsModalVisible(false);
        setEditingExpense(null);
      })
      .catch(error => {
        console.error('Error updating expense:', error);
      });
  };

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={expenses}
        renderItem={expense => (
          <List.Item>
            <List.Item.Meta
              title={`$ ${expense.amount} - ${expense.description} - ${expense.category}`}
              description={[
                <Button style={{ marginRight: 8 }} onClick={() => showEditModal(expense)}>Editar</Button>,
                <Button onClick={() => removeExpense(expense.id)}>Remover</Button>
              ]}
            />
          </List.Item>
        )}
      />

      <Modal
        title="Editar despesa"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEdit} layout="vertical">
          <Form.Item name="date" label="Data" rules={[{ required: true, message: 'Selecione uma data!' }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="description" label="Descrição" rules={[{ required: true, message: 'Informe uma descrição!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Categoria" rules={[{ required: true, message: 'Informe uma categoria!' }]}>
            <Select>
              <Select.Option value="locomoção">Locomoção</Select.Option>
              <Select.Option value="lazer">Casa</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Valor" rules={[{ required: true, message: 'Informe um valor!' }]}>
            <InputNumber<number>
              defaultValue={1000}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Salvar Despesa
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExpenseList;
