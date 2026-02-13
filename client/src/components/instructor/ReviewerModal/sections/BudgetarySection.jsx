// components/ReviewerModal/sections/BudgetarySection.jsx
import React from 'react';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES, BUDGET_CATEGORIES } from '../../../../constants/proposalConstants';

const BudgetarySection = ({ normalized, isEditing, setEditedData }) => {
  const handleBudgetFieldChange = (category, index, field, value) => {
    setEditedData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.reviews_per_docs.budgetary_requirement.budgetary_requirement[category][index][field] = value;
      return newData;
    });
  };

  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-10 text-xl">
        {SECTION_TITLES.BUDGETARY}
      </h3>

      <table className="w-full border border-black text-sm mt-6">
        <tbody>
          <tr className="border-b border-black bg-gray-100">
            <td className="border-r border-black px-4 py-3 font-bold text-center">
              CATEGORY
            </td>
            <td className="border-r border-black px-4 py-3 font-bold text-center">
              ITEM
            </td>
            <td className="border-r border-black px-4 py-3 font-bold text-center">
              Cost (PHP)
            </td>
            <td className="border-r border-black px-4 py-3 font-bold text-center">
              PAX/QTY.
            </td>
            <td className="px-4 py-3 font-bold text-center">
              AMOUNT
            </td>
          </tr>

          <BudgetCategoryRows
            category={BUDGET_CATEGORIES.MEALS}
            label="Meals"
            items={normalized?.budget?.content?.meals}
            isEditing={isEditing}
            onFieldChange={handleBudgetFieldChange}
          />

          <BudgetCategoryRows
            category={BUDGET_CATEGORIES.TRANSPORT}
            label="Transport"
            items={normalized?.budget?.content?.transport}
            isEditing={isEditing}
            onFieldChange={handleBudgetFieldChange}
          />

          <BudgetCategoryRows
            category={BUDGET_CATEGORIES.SUPPLIES}
            label="Supplies"
            items={normalized?.budget?.content?.supplies}
            isEditing={isEditing}
            onFieldChange={handleBudgetFieldChange}
          />

          <tr className="font-bold bg-gray-100">
            <td colSpan={4} className="border-r border-black px-4 py-3 text-right">
              Grand Total
            </td>
            <td className="px-4 py-3 text-right">
              <p>₱ {normalized?.budget?.content?.totals?.grand_total || 0}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <ReviewList reviews={normalized?.budget.reviews} />
    </div>
  );
};

const BudgetCategoryRows = ({ category, label, items, isEditing, onFieldChange }) => {
  if (!items || items.length === 0) return null;

  return items.map((row, index) => (
    <tr key={`${category}-${index}`} className="border-b border-black">
      <td className="border-r border-black px-4 py-3">{label}</td>
      <td className="border-r border-black px-4 py-3">
        {isEditing ? (
          <input
            type="text"
            value={row.item || ""}
            onChange={(e) => onFieldChange(category, index, 'item', e.target.value)}
            className="w-full border-2 border-blue-500 rounded px-2 py-1"
          />
        ) : (
          row.item
        )}
      </td>
      <td className="border-r border-black px-4 py-3 text-right">
        {isEditing ? (
          <input
            type="number"
            value={row.cost || ""}
            onChange={(e) => onFieldChange(category, index, 'cost', e.target.value)}
            className="w-full border-2 border-blue-500 rounded px-2 py-1"
          />
        ) : (
          `₱ ${row.cost}`
        )}
      </td>
      <td className="border-r border-black px-4 py-3 text-right">
        {isEditing ? (
          <input
            type="number"
            value={row.qty || ""}
            onChange={(e) => onFieldChange(category, index, 'qty', e.target.value)}
            className="w-full border-2 border-blue-500 rounded px-2 py-1"
          />
        ) : (
          row.qty
        )}
      </td>
      <td className="px-4 py-3 text-right">₱ {row.amount}</td>
    </tr>
  ));
};

export default BudgetarySection;