# Arquitetura event-driven com NestJS e RabbitMQ

Repositório de apoio ao curso **[Arquitetura Event-Driven com NestJS e RabbitMQ](https://www.udemy.com/course/arquitetura-event-driven-com-nestjs-e-rabbitmq/)** na Udemy.

Três microsserviços (`order-service`, `inventory-service`, `payment-service`) trocam eventos via **RabbitMQ** e persistem dados em **Postgres** (um banco por serviço). O fluxo de pedido segue uma **saga por coreografia**: criar pedido → reservar estoque → pagar → atualizar status (ou compensar em caso de falha).

## Serviços

| Pasta | Papel |
|-------|--------|
| `order-service` | API HTTP (`POST/GET /orders`) e consumidor de eventos de fechamento |
| `inventory-service` | Reserva e reverte estoque |
| `payment-service` | Processa pagamento (simulado) e publica sucesso/falha |

## Subir o projeto

```bash
docker compose up --build
```

| O quê | Onde |
|-------|------|
| API de pedidos | http://localhost:3000 |
| RabbitMQ Management | http://localhost:15672 — `admin` / `admin` |
| Health | `GET /health` e `GET /health/ready` (order-service) |

Variáveis de ambiente: copie [`.env.example`](.env.example) se for rodar os apps fora do Compose.

**Banco:** `synchronize` está desligado; o schema é aplicado por **migrations** TypeORM (`src/database/migrations/`). No Docker as migrations rodam automaticamente ao subir cada serviço. Localmente, em cada pasta de serviço: `yarn migration:run`.

## Testar um pedido

Produtos já seedados no estoque: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`, `b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12`.

```bash
curl -sS -X POST http://localhost:3000/orders \
  -H 'Content-Type: application/json' \
  -d '{
    "customerId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    "items": [
      { "productId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "quantity": 2, "price": 19.9 }
    ],
    "payment": { "method": "pix", "amount": 100 },
    "delivery": { "method": "pickup", "addressId": "dddddddd-dddd-4ddd-8ddd-dddddddddddd" }
  }'
```

Consulte o pedido pelo `id` retornado: `GET http://localhost:3000/orders/<id>`. Status final esperado: **CONFIRMED**.

## Cenários de falha (demo)

- **Sem estoque:** `quantity` maior que o saldo ou `productId` inexistente → pedido **INSUFFICIENT_STOCK**.
- **Pagamento falho:** no `docker-compose.yml`, defina `FAIL_PAYMENT_AMOUNT` com o mesmo valor de `payment.amount` do JSON (ex.: `100`) → pedido **FAILED** e estoque revertido.

## Organização do código

Em cada serviço, a lógica fica em `src/modules/<contexto>/` com camadas **domain → application (use cases + ports) → infrastructure → presentation**. Detalhes e conceitos são explicados no curso.

## CI

Build dos três apps: [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
