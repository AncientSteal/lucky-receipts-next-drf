"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <section>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.logoGroup}>
              <span className={styles.logoText}>Чек на удачу</span>
              <span className={styles.badge}>Акция 2026</span>
            </div>
            <Link href="/login" className={styles.btnLogin}>
              Войти
            </Link>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroInner}>
              <p className={styles.heroSubtitle}>
                Период проведения: с 1 января по 31 декабря 2026 года
              </p>
              <h1 className={styles.heroTitle}>
                Регистрируйте чеки от 1 000 ₽ и участвуйте в розыгрыше
              </h1>
              <p className={styles.heroDescription}>
                Покупайте товары, загружайте фискальные чеки в личном кабинете и
                отслеживайте статус модерации в реальном времени.
              </p>
              <div className={styles.heroActions}>
                <Link
                  href="http://localhost:8000/api-auth/login/"
                  className={styles.btnPrimary}
                >
                  Зарегистрировать чек
                </Link>
                <a href="#how-it-works" className={styles.btnSecondary}>
                  Правила и инструкция
                </a>
              </div>
            </div>
          </section>

          <section className={styles.container}>
            <div className={styles.gridThree}>
              <div className={styles.card}>
                <div className={styles.cardLabel}>Минимальная сумма</div>
                <div className={styles.cardValue}>от 1 000 ₽</div>
                <p className={styles.cardText}>
                  В акции участвуют кассовые чеки на сумму от одной тысячи
                  рублей с учётом всех скидок.
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardLabel}>Сроки акции</div>
                <div className={styles.cardValue}>Весь 2026 год</div>
                <p className={styles.cardText}>
                  Регистрация чеков открыта с 01.01.2026 по 31.12.2026
                  включительно.
                </p>
              </div>

              <div className={styles.card}>
                <div className={styles.cardLabel}>Модерация</div>
                <div className={styles.cardValue}>До 5 раб. дней</div>
                <p className={styles.cardText}>
                  Каждый чек проходит проверку фискальных данных администратором
                  сервиса.
                </p>
              </div>
            </div>
          </section>

          <section id="how-it-works" className={styles.container}>
            <h2 className={styles.sectionTitle}>Как принять участие</h2>
            <div className={styles.gridThree}>
              <div>
                <span className={styles.stepNumber}>1</span>
                <h3 className={styles.stepTitle}>Войдите в аккаунт</h3>
                <p className={styles.cardText}>
                  Зарегистрируйтесь или авторизуйтесь в системе, чтобы получить
                  доступ к личному кабинету со списком ваших чеков.
                </p>
              </div>

              <div>
                <span className={styles.stepNumber}>2</span>
                <h3 className={styles.stepTitle}>Заполните форму чека</h3>
                <p className={styles.cardText}>
                  Укажите фискальные реквизиты вручную или вставьте готовую
                  строку из QR-кода чека.
                </p>
              </div>

              <div>
                <span className={styles.stepNumber}>3</span>
                <h3 className={styles.stepTitle}>Дождитесь проверки</h3>
                <p className={styles.cardText}>
                  Отслеживайте статус модерации в личном кабинете. Проверка
                  занимает не более 5 рабочих дней.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.container}>
            <div className={styles.gridTwo}>
              <div className={styles.card}>
                <h3 className={styles.boxTitle}>
                  Какие данные нужны для добавления чека
                </h3>
                <p className={styles.cardText}>
                  Вы можете заполнить поля формы вручную с бумажного или
                  электронного чека:
                </p>
                <ul className={styles.list}>
                  <li>
                    <strong>ФН</strong> — номер фискального накопителя (16 цифр)
                  </li>
                  <li>
                    <strong>ФД</strong> — номер фискального документа
                  </li>
                  <li>
                    <strong>ФП</strong> — фискальный признак документа
                  </li>
                  <li>
                    <strong>Сумма покупки</strong> (не менее 1 000 ₽) и{" "}
                    <strong>дата/время</strong>
                  </li>
                </ul>

                <div className={styles.qrBox}>
                  <p className={styles.qrLabel}>
                    Или вставьте строку QR-кода целиком:
                  </p>
                  <code className={styles.qrCode}>
                    t=20260930T145500&amp;s=1850.20&amp;fn=9999456789123456&amp;i=7788&amp;fp=33445566
                  </code>
                </div>
              </div>

              <div className={styles.card}>
                <h3 className={styles.boxTitle}>
                  Статусы проверки в личном кабинете
                </h3>
                <p className={styles.cardText}>
                  После отправки каждый чек попадает в ваш личный кабинет и
                  получает один из трёх статусов:
                </p>

                <div className={styles.statusList}>
                  <div className={styles.statusItem}>
                    <span
                      className={`${styles.statusBadge} ${styles.statusPending}`}
                    >
                      На проверке
                    </span>
                    <p className={styles.cardText}>
                      Чек принят в обработку. Модератор сверит фискальные данные
                      в течение 5 рабочих дней.
                    </p>
                  </div>

                  <div className={styles.statusItem}>
                    <span
                      className={`${styles.statusBadge} ${styles.statusApproved}`}
                    >
                      Принят
                    </span>
                    <p className={styles.cardText}>
                      Реквизиты подтверждены, сумма соответствует правилам. Чек
                      участвует в акции.
                    </p>
                  </div>

                  <div className={styles.statusItem}>
                    <span
                      className={`${styles.statusBadge} ${styles.statusRejected}`}
                    >
                      Отклонён
                    </span>
                    <p className={styles.cardText}>
                      Чек не прошёл проверку (ошибка в реквизитах, дубликат,
                      сумма меньше 1 000 ₽ или дата вне сроков акции).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </section>
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <p>© 2026 «Чек на удачу». Все права защищены.</p>
          <p>Срок проверки чеков: до 5 рабочих дней.</p>
        </div>
      </footer>
    </>
  );
}
