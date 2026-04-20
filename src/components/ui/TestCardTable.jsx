import { TEST_CARDS } from '../../utils/constants.js';
import styles from './TestCardTable.module.css';

const GROUP_LABELS = {
  success: 'Success',
  '3ds': '3DS Flows',
  failure: 'Failure Scenarios',
};

// CSS modules can't use '3ds' as a class name — map it
const GROUP_STYLE = { success: 'success', '3ds': 'threeds', failure: 'failure' };

export function TestCardTable() {
  const groups = ['success', '3ds', 'failure'];

  return (
    <div className={styles.wrap}>
      {groups.map((group) => {
        const cards = TEST_CARDS.filter((c) => c.group === group);
        const cls = GROUP_STYLE[group];
        return (
          <div key={group} className={styles.group}>
            <div className={`${styles.groupLabel} ${styles[cls]}`}>
              {GROUP_LABELS[group]}
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Network</th>
                  <th>Card Number</th>
                  <th>Expiry / CVC</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.number}>
                    <td>{card.network}</td>
                    <td className={styles.mono}>{card.number}</td>
                    <td className={styles.muted}>12/26 / 100</td>
                    <td>
                      <span className={`${styles.outcome} ${styles[cls]}`}>
                        {card.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
