# Real-time Task Monitoring with Supabase

This guide explains how to monitor task status changes in real-time using Supabase subscriptions.

## Features

- ✅ **Real-time status updates** - Get notified when task status changes
- ✅ **Automatic progress tracking** - Visual progress bar updates based on task status
- ✅ **Connection status** - Shows if real-time connection is active
- ✅ **Error handling** - Graceful error handling for connection issues
- ✅ **Auto-redirect** - Automatically redirect when task completes

## Setup

### 1. Enable Real-time in Supabase

Make sure your Supabase project has real-time enabled for the `tasks` table:

```sql
-- Enable real-time for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

### 2. Use the Hook

```tsx
import { useTaskStatus } from "@/hooks/useTaskRealtimeStatus";

// Monitor a specific task
const { currentTask, isConnected, error } = useTaskStatus("task-id-here", {
  onStatusChange: (task) => {
    console.log("Status changed:", task.status);
  },
  onComplete: (task) => {
    console.log("Task completed!");
    // Redirect or show success message
  },
  onFailed: (task) => {
    console.log("Task failed:", task);
    // Show error message
  },
});
```

## Usage Examples

### Basic Task Monitoring

```tsx
const MyComponent = ({ taskId }) => {
  const { currentTask, isConnected } = useTaskStatus(taskId);

  return (
    <div>
      <p>Status: {currentTask?.status}</p>
      <p>Connected: {isConnected ? "✅" : "❌"}</p>
    </div>
  );
};
```

### Progress Tracking

```tsx
const TaskProgress = ({ taskId }) => {
  const [progress, setProgress] = useState(0);

  const { currentTask } = useTaskStatus(taskId, {
    onStatusChange: (task) => {
      switch (task.status) {
        case "pending":
          setProgress(25);
          break;
        case "processing":
          setProgress(65);
          break;
        case "completed":
          setProgress(100);
          break;
        case "failed":
          setProgress(0);
          break;
      }
    },
  });

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
```

### Auto-redirect on Completion

```tsx
const TaskMonitor = ({ taskId, contentId }) => {
  const router = useRouter();

  useTaskStatus(taskId, {
    onComplete: (task) => {
      // Wait 2 seconds then redirect
      setTimeout(() => {
        router.push(`/creation/${contentId}`);
      }, 2000);
    },
  });

  return <LoadingScreen />;
};
```

### Monitor All User Tasks

```tsx
import { useUserTasks } from "@/hooks/useTaskRealtimeStatus";

const UserTasksList = ({ userId }) => {
  const { isConnected } = useUserTasks(userId, {
    onStatusChange: (task) => {
      // Update UI when any user task changes
      console.log(`Task ${task.id} status: ${task.status}`);
    },
  });

  return (
    <div>
      <p>Monitoring all tasks for user {userId}</p>
      <p>Connection: {isConnected ? "Active" : "Disconnected"}</p>
    </div>
  );
};
```

## Task Status Flow

```
pending → processing → completed ✅
                   → failed ❌
```

### Status Meanings

- **`pending`** - Task created, waiting to be processed
- **`processing`** - Task is currently being worked on
- **`completed`** - Task finished successfully
- **`failed`** - Task encountered an error

## Error Handling

The hook provides error states for connection issues:

```tsx
const { error, isConnected } = useTaskStatus(taskId);

if (error) {
  return <div>Connection error: {error}</div>;
}

if (!isConnected) {
  return <div>Connecting to real-time updates...</div>;
}
```

## Integration with UI Components

### Generating Component

The `Generating` component automatically uses real-time updates when given a `taskId`:

```tsx
// Without real-time (shows demo progress)
<Generating />

// With real-time monitoring
<Generating taskId="task-123" contentId="content-456" />
```

### Creation Flow

```tsx
const CreateContent = () => {
  const [taskId, setTaskId] = useState(null);

  const handleSubmit = async (data) => {
    const task = await TasksService.createTask([data]);
    setTaskId(task[0].id);
  };

  if (taskId) {
    return <Generating taskId={taskId} />;
  }

  return <CreateForm onSubmit={handleSubmit} />;
};
```

## Performance Notes

- ✅ **Automatic cleanup** - Subscriptions are cleaned up when component unmounts
- ✅ **Single connection** - Each hook creates one real-time connection
- ✅ **Efficient filtering** - Uses Supabase filters to only receive relevant updates
- ⚠️ **Connection limits** - Be mindful of concurrent real-time connections

## Troubleshooting

### Real-time not working?

1. **Check Supabase settings** - Make sure real-time is enabled for the tasks table
2. **Verify table permissions** - Ensure your RLS policies allow real-time access
3. **Check console** - Look for connection errors in browser console
4. **Test manually** - Try updating a task status directly in Supabase to see if updates come through

### Common Issues

```tsx
// ❌ Don't use empty taskId
useTaskStatus("");

// ✅ Handle undefined taskId
useTaskStatus(taskId || "", { ... });

// ❌ Don't create multiple subscriptions for same task
const hook1 = useTaskStatus(taskId);
const hook2 = useTaskStatus(taskId); // Duplicate!

// ✅ Share the same hook across components
const taskStatus = useTaskStatus(taskId);
```

## Advanced Usage

### Custom Status Messages

```tsx
const getStatusMessage = (status: string) => {
  switch (status) {
    case "pending":
      return "Analyzing your requirements...";
    case "processing":
      return "Creating your content...";
    case "completed":
      return "Content ready!";
    case "failed":
      return "Something went wrong.";
    default:
      return "Preparing...";
  }
};
```

### Multiple Task Monitoring

```tsx
const MultiTaskMonitor = ({ taskIds }) => {
  return (
    <div>
      {taskIds.map((taskId) => (
        <TaskStatusCard key={taskId} taskId={taskId} />
      ))}
    </div>
  );
};
```

This real-time monitoring system provides a smooth, professional user experience with instant updates and automatic progression through your content creation workflow.
