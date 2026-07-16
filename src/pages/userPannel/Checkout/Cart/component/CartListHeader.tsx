interface CartListHeaderProps {
  selectedCount: number;
  totalCount: number;
}

const CartListHeader = ({ selectedCount, totalCount }: CartListHeaderProps) => (
  <div className="flex items-center justify-between border-b border-border pb-3">
    <p className="font-body text-sm font-semibold text-admin-text">
      {selectedCount}/{totalCount} ITEMS SELECTED
    </p>
  </div>
);

export default CartListHeader;
