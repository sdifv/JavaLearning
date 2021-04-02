package com.yhao.threadPool.impl;

import com.yhao.threadPool.intf.DenyPolicy;
import com.yhao.threadPool.intf.RunnableQueue;
import com.yhao.threadPool.intf.ThreadPool;

import java.util.LinkedList;

public class LinkedRunnableQueue implements RunnableQueue {
    private final int limit;

    private final DenyPolicy denyPolicy;

    // 共享资源
    private final LinkedList<Runnable> runnableList = new LinkedList<>();

    // 线程池
    private final ThreadPool threadPool;

    public LinkedRunnableQueue(int limit, DenyPolicy denyPolicy, ThreadPool threadPool) {
        this.limit = limit;
        this.denyPolicy = denyPolicy;
        this.threadPool = threadPool;
    }

    @Override
    public void offer(Runnable runnable) {
        synchronized (runnableList) {
            if (runnableList.size() >= limit) {
                denyPolicy.reject(runnable, threadPool);
            } else {
                runnableList.addLast(runnable);
                // 唤醒阻塞中的线程
                runnableList.notifyAll();
            }
        }
    }

    @Override
    public Runnable take() throws InterruptedException {
        synchronized (runnableList) {
            while (runnableList.isEmpty()) {
                try {
                    // 任务队列中没有可执行任务，当前线程被挂起，
                    // 进入runnableList关联的monitor wait set中等待唤醒
                    runnableList.wait();
                } catch (InterruptedException e) {
                    throw e;
                }
            }
            return runnableList.removeFirst();
        }
    }

    @Override
    public int size() {
        synchronized (runnableList) {
            return runnableList.size();
        }
    }
}
