// frontend/pages/purchases/index.js
import PurchaseForm from '../../components/PurchaseForm';
import PurchaseTable from '../../components/PurchaseTable';
import styles from '../../styles/purchases.module.css';

export default function PurchasesPage() {
    return (
        <div className={styles.container}>
            <h1>Compras</h1>
            <PurchaseForm />
            <PurchaseTable />
        </div>
    );
}
