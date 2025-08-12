<?php

namespace Kanboard\Plugin\CardNavigator\Controller;

use Kanboard\Controller\PluginController;

class CardNavigatorController extends PluginController
{
    /**
     * Navigate to next task
     */
    public function next()
    {
        $task_id = $this->request->getIntegerParam('task_id');
        $next_task_id = $this->getAdjacentTask($task_id, 1);
        
        if ($next_task_id) {
            $this->response->redirect($this->helper->url->to('TaskViewController', 'show', array('task_id' => $next_task_id)));
        } else {
            $this->response->redirect($this->helper->url->to('TaskViewController', 'show', array('task_id' => $task_id)));
        }
    }

    /**
     * Navigate to previous task
     */
    public function prev()
    {
        $task_id = $this->request->getIntegerParam('task_id');
        $prev_task_id = $this->getAdjacentTask($task_id, -1);
        
        if ($prev_task_id) {
            $this->response->redirect($this->helper->url->to('TaskViewController', 'show', array('task_id' => $prev_task_id)));
        } else {
            $this->response->redirect($this->helper->url->to('TaskViewController', 'show', array('task_id' => $task_id)));
        }
    }

    /**
     * Get adjacent task ID
     * @param int $task_id Current task ID
     * @param int $direction 1 for next, -1 for previous
     * @return int|null Adjacent task ID or null if none found
     */
    private function getAdjacentTask($task_id, $direction)
    {
        $task = $this->taskFinderModel->getById($task_id);
        if (!$task || !$this->projectPermissionModel->isUserAllowed($task['project_id'], $this->userSession->getId())) {
            return null;
        }

        // Get all tasks in project ordered by position
        $tasks = $this->db->table('tasks')
            ->columns('id', 'column_id', 'swimlane_id', 'position')
            ->join('columns', 'id', 'column_id')
            ->eq('tasks.project_id', $task['project_id'])
            ->eq('tasks.is_active', 1)
            ->asc('columns.position')
            ->asc('tasks.swimlane_id')
            ->asc('tasks.position')
            ->findAll();

        $current_index = null;
        foreach ($tasks as $index => $t) {
            if ($t['id'] == $task_id) {
                $current_index = $index;
                break;
            }
        }

        if ($current_index === null) {
            return null;
        }

        $target_index = $current_index + $direction;
        return isset($tasks[$target_index]) ? $tasks[$target_index]['id'] : null;
    }
}