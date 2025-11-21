import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Payroll = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const response = await api.get('/payroll');
      setRecords(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch payroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8">No payroll records found</td></tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{record.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${record.basic_salary?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${record.allowances?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-red-600">${record.deductions?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${record.net_salary?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${record.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
