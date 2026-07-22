# Wireframes — Consolas del core

Wireframes de baja fidelidad de las pantallas de administración del core de plataforma y del **shell de notificaciones (C6)**. Formato: [`plantilla-maestra-sgm.md`](../../arquitectura/instrucciones/plantilla-maestra-sgm.md) §7.

**Convención de nombres:** `NN-kebab-case.md` dentro de `subdere/`, `municipal/` o `shell/`. No correlacionan con sub-pasos de módulos funcionales (las consolas no son flujo de expediente).

**Regla API-first:** toda acción mapea a un `operationId` de [`contracts.md`](../contracts.md). Si la operación aún no tiene cuerpo HTTP completo, se marca *(inferido)* y aparece en §2.11.

| Consola / superficie | Pantallas |
|---|---|
| SUBDERE | [`subdere/`](./subdere/) — 01 a 07 |
| Municipal | [`municipal/`](./municipal/) — 01 a 09 |
| Shell | [`shell/`](./shell/) — campanita, bandeja, mis datos, chat FAB, listado chats · prototipos en `sgm-prototipos/` |

Índice narrativo: [`../overview.md`](../overview.md). Notificaciones: [`../notificaciones/overview.md`](../notificaciones/overview.md). Mensajería: [`../mensajeria/overview.md`](../mensajeria/overview.md). Marco: [`plataforma-core.md`](../../arquitectura/especificacion/plataforma-core.md) §9.
