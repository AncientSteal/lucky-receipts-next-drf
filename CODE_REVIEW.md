# 📋 Подробный Код-ревью: Next.js + Django REST Framework проект "Чек на удачу"

## 🎯 Общее впечатление
**Оценка: 7.5/10** - это хороший MVP для портфолио джуниора!

Вы:
- ✅ Работали с современным стеком (Next.js 16, React 19, Django 5.1)
- ✅ Реализовали полный цикл приложения
- ✅ Добавили тесты (PyTest, Zod валидация)
- ✅ Настроили Docker для разработки
- ✅ Защитили от BOLA/IDOR уязвимостей

---

## 🔴 КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### 1. **Hardcoded URLs - большая проблема для продакшена**
**Файл:** `backend/receipts/views.py:96`
```python
# ❌ Hardcoded - сломается на production
return redirect('http://localhost:3000/')
```

**Решение:** Используйте переменные окружения
```python
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
return redirect(f'{FRONTEND_URL}/')
```

---

### 2. **Не используется getApi.ts везде на фронтенде**
**Файл:** `frontend/src/app/store/useReceiptsStore.ts:44`

**Проблема:** URL захардкодирован, не используется утилита
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

**Решение:**
```typescript
import { getApiUrl } from "@/app/utils/getApi";
const apiUrl = getApiUrl();
```

---

### 3. **Нет обработки 401 ошибок**
**Проблема:** При разлогине пользователь не редиректится на /login

**Решение:**
```typescript
if (response.status === 401) {
  useUserStore.setState({ user: null });
  window.location.href = '/login';
  return;
}
```

---

## 🟠 ВАЖНЫЕ ПРОБЛЕМЫ

### 4. **Empty `/rules` страница**
**Файл:** `frontend/src/app/rules/page.tsx` - полностью пусто
- На главной есть ссылка
- Но страница пустая
- Удалите ссылку или заполните правила

---

### 5. **Недостаток валидации ФН/ФД/ФП**
**Файл:** `frontend/src/schemas/receipt.schema.ts`

ФН должен быть РОВНО 16 цифр (стандарт ФНС):
```typescript
fn: z.string().length(16, "ФН ровно 16 цифр")
fd: z.string().max(10, "ФД максимум 10")
fp: z.string().max(10, "ФП максимум 10")
```

---

### 6. **Нет логирования на бэкенде**
**Файл:** `backend/receipts/views.py`

Добавьте:
```python
import logging
logger = logging.getLogger(__name__)
logger.warning(f"Failed login: {username}")
logger.exception("Error during login")
```

---

### 7. **Плохая обработка ошибок в хуках**
Слишком сложная логика проверки timeout. Упростите и разделите на отдельные функции.

---

### 8. **Нет rate-limiting на login**
Брутфорс атаки возможны! Добавьте:
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'anon': '5/min',
        'user': '20/min'
    }
}
```

---

### 9. **Нет CSP headers**
Защита от XSS атак отсутствует. Добавьте:
```python
SECURE_CONTENT_SECURITY_POLICY = {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
}
```

---

### 10. **Нет валидаторов в Django моделях**
```python
from django.core.validators import RegexValidator

fn = models.CharField(
    max_length=16,
    validators=[
        RegexValidator(r'^\d{16}$', 'ФН: ровно 16 цифр')
    ]
)
```

---

## 🟢 ЧТО СДЕЛАНО ХОРОШО

✅ **BOLA/IDOR защита:**
```python
def get_queryset(self):
    return Receipt.objects.filter(user=self.request.user)
```
Критично и правильно!

✅ **Zod для типизации** - отличный выбор

✅ **Docker Compose** - хорошо настроен

✅ **Изоморфные API URLs** - понимаете SSR

✅ **Тесты** - покрывают критичную логику
