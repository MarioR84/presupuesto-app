# 🧪 Instrucciones de Prueba - Presupuesto App

**URL de la Aplicación:** https://presupuesto-app-one.vercel.app/login

---

## 📋 Requisitos Previos
- Dispositivo con navegador web (celular, tablet, laptop)
- Conexión a internet
- Navegadores soportados: Chrome, Firefox, Safari, Edge (versiones recientes)

---

## 🔐 1. Crear Cuenta y Login

### Registrarse:
1. Abre la URL de la app
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Ingresa:
   - **Email:** (ej: `prueba@test.com`)
   - **Contraseña:** (mínimo 6 caracteres, ej: `123456`)
4. Haz clic en "Crear Cuenta"
5. Deberías ver la pantalla de Inicio

### Login (si ya tienes cuenta):
1. Ingresa Email y Contraseña
2. Haz clic en "Iniciar Sesión"
3. Deberías ver la pantalla de Inicio

---

## ✅ 2. Flujo Principal a Probar

### A. Crear Presupuesto
1. Haz clic en **"Presupuestos"** en el menú
2. Haz clic en **"Crear Presupuesto"**
3. Completa:
   - **Nombre:** Ej: `Casa`, `Viaje`, `Alimentación`
   - **Mes:** Selecciona de la lista desplegable (Enero, Febrero, etc.)
   - **Monto:** Ej: `100000`
4. Haz clic en **"Guardar"**
5. Verifica que aparezca en la lista de presupuestos

### B. Agregar Gastos
1. Desde **"Presupuestos"**, haz clic en el presupuesto que creaste
2. Haz clic en **"Agregar Gasto"**
3. Completa:
   - **Descripción:** Ej: `Arriendo`, `Groceries`
   - **Monto:** Ej: `25000`
4. Haz clic en **"Agregar"**
5. Verifica que:
   - El gasto aparezca en la lista
   - El "Restante" disminuya correctamente

### C. Ver Dashboard
1. Haz clic en **"Dashboard"** en el menú
2. Deberías ver:
   - **Presupuesto Total:** suma de todos tus presupuestos
   - **Gasto Total:** suma de todos tus gastos
   - **% Usado:** porcentaje del presupuesto gastado
   - **Presupuesto Restante:** lo que te falta por gastar
   - **Cantidad de Presupuestos:** número total de presupuestos

### D. Navegar a "Gasto"
1. Haz clic en **"Gasto"** en el menú
2. Deberías ver un listado de todos tus presupuestos
3. Haz clic en uno para ver sus gastos

---

## 🧪 3. Casos de Prueba Específicos

### Caso 1: Deduplicación de Presupuestos
**Objetivo:** Verificar que no se pueden crear presupuestos con el mismo nombre (case-insensitive)

1. Crea presupuesto: `Casa`, Enero, ₡100000
2. Intenta crear otro: `casa`, Enero, ₡50000
3. **Resultado esperado:** La app debe acumular los meses y aumentar el monto a ₡150000 (no crear uno nuevo)

### Caso 2: Acumulación de Meses
**Objetivo:** Verificar que un presupuesto puede tener múltiples meses

1. Crea presupuesto: `Viaje`, Enero, ₡50000
2. Intenta crear otro: `Viaje`, Febrero, ₡50000
3. **Resultado esperado:** El presupuesto "Viaje" debe mostrar "Enero, Febrero" y monto total ₡100000

### Caso 3: Perseverancia de Datos
**Objetivo:** Verificar que los datos se guardan aunque cierres la app

1. Crea presupuestos y gastos
2. Cierra completamente el navegador
3. Reabre la app (en el mismo dispositivo)
4. **Resultado esperado:** Los presupuestos y gastos siguen ahí

### Caso 4: Logout
**Objetivo:** Verificar que puedes cerrar sesión correctamente

1. Haz clic en **"Salir"** en el menú superior derecho
2. **Resultado esperado:** Se cierre sesión y veas pantalla de "Despedida" con opción de volver al Login

### Caso 5: Múltiples Dispositivos
**Objetivo:** Verificar que cada dispositivo tiene su propia sesión

1. Abre la app en el Dispositivo A → crea cuenta y presupuestos
2. Abre la app en el Dispositivo B → crea cuenta diferente
3. **Resultado esperado:** Cada dispositivo tiene sus propios presupuestos (NO se sincronizan entre dispositivos aún)

---

## 📸 4. Pruebas de UI/UX

- [ ] El menú superior funciona en todos los botones
- [ ] Los botones "Salir" funcionan sin causar crashes
- [ ] Todos los inputs aceptan valores correctamente
- [ ] Las validaciones muestran mensajes de error apropiados
- [ ] La app es responsive en celular, tablet y desktop
- [ ] Los colores y estilos se ven bien
- [ ] No hay textos cortados o mal alineados

---

## ⚠️ 5. Reporte de Bugs

Si encuentras un problema, reporta:
1. **¿En qué página estabas?** (Login, Presupuestos, Dashboard, etc.)
2. **¿Qué hiciste exactamente?** (paso a paso)
3. **¿Qué esperabas que sucediera?**
4. **¿Qué sucedió en lugar de eso?**
5. **¿En qué dispositivo/navegador?** (Chrome en Android, Safari en iPhone, etc.)
6. **Screenshots si es posible**

---

## 🎯 6. Checklist Final

Antes de considerar la app lista, verifica:

- [ ] Puedo registrarme y hacer login
- [ ] Puedo crear presupuestos con diferentes meses
- [ ] Los presupuestos con el mismo nombre se acumulan
- [ ] Puedo agregar gastos y disminuyen el "Restante"
- [ ] El Dashboard muestra números correctos
- [ ] Puedo cerrar sesión sin que se caiga la app
- [ ] Los datos persisten después de cerrar el navegador
- [ ] La app funciona en múltiples navegadores
- [ ] No hay mensajes de error en la consola del navegador (F12)

---

## 💬 Contacto

Si tienes dudas durante las pruebas, pregunta. 

¡Gracias por testear! 🎉
