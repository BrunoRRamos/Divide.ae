
import { describe, it, expect, beforeEach } from 'vitest';
import { createBill, deleteBill, getOneBillProcedure, getAllBillsProcedure, updateBillProcedure } from './billProcedures';
import { z } from 'zod';

let ctx: any;

beforeEach(() => {
  ctx = {
    db: {
      bill: {
        create: vi.fn(),
        delete: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
      },
    },
  };
});

describe('Bill CRUD operations', () => {
  it('should create a bill', async () => {
    const input = {
      name: 'Electricity Bill',
      value: 100,
      groupId: 'group-1',
    };

    ctx.db.bill.create.mockResolvedValue(input);

    const result = await createBill.mutation({ ctx, input });

    expect(ctx.db.bill.create).toHaveBeenCalledWith({ data: input });
    expect(result).toEqual(input);
  });

  it('should delete a bill', async () => {
    const billId = 'bill-1';

    ctx.db.bill.delete.mockResolvedValue({ id: billId });

    const result = await deleteBill.mutation({ ctx, input: billId });

    expect(ctx.db.bill.delete).toHaveBeenCalledWith({ where: { id: billId } });
    expect(result.id).toBe(billId);
  });

  it('should get a bill by id', async () => {
    const bill = { id: 'bill-1', name: 'Internet Bill', value: 50, groupId: 'group-1' };

    ctx.db.bill.findFirst.mockResolvedValue(bill);

    const result = await getOneBillProcedure.byId.query({ ctx, input: { id: 'bill-1' } });

    expect(ctx.db.bill.findFirst).toHaveBeenCalledWith({ where: { id: 'bill-1' } });
    expect(result).toEqual(bill);
  });

  it('should get all bills', async () => {
    const bills = [
      { id: 'bill-1', name: 'Internet Bill', value: 50, groupId: 'group-1' },
      { id: 'bill-2', name: 'Water Bill', value: 30, groupId: 'group-1' },
    ];

    ctx.db.bill.findMany.mockResolvedValue(bills);

    const result = await getAllBillsProcedure.all.query({ ctx });

    expect(ctx.db.bill.findMany).toHaveBeenCalled();
    expect(result).toEqual(bills);
  });

  it('should update a bill', async () => {
    const input = {
      id: 'bill-1',
      groupId: 'group-1',
      amount: 120,
      dueAt: new Date(),
    };

    ctx.db.bill.update.mockResolvedValue(input);

    const result = await updateBillProcedure.update.mutation({ ctx, input });

    expect(ctx.db.bill.update).toHaveBeenCalledWith({ where: { id: input.id }, data: { groupId: 'group-1', amount: 120, dueAt: input.dueAt } });
    expect(result).toEqual(input);
  });
});
