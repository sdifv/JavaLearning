package com.yhao.threadPool.intf;

@FunctionalInterface // “函数式接口”是指仅仅只包含一个抽象方法的接口
public interface DenyPolicy {
    void reject(Runnable runnable, ThreadPool threadPool);

    // 该拒绝策略会直接将任务丢弃
    class DiscardDenyPolicy implements DenyPolicy{

        @Override
        public void reject(Runnable runnable, ThreadPool threadPool) {
            // do nothing
        }
    }

    // 该拒绝策略会向任务提交者抛出异常
    class AbortDenyPolicy implements DenyPolicy{

        @Override
        public void reject(Runnable runnable, ThreadPool threadPool) {
            throw new RuntimeException("The runnable " + runnable + " will be abort.");
        }
    }

    // 该拒绝策略会使任务在体检这所在的线程中执行
    class RunnerDenyPolicy implements DenyPolicy{

        @Override
        public void reject(Runnable runnable, ThreadPool threadPool) {
            if(!threadPool.isShutdown()){
                runnable.run();
            }
        }
    }
}
