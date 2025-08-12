<?php

namespace Kanboard\Plugin\CardNavigator;

use Kanboard\Core\Plugin\Base;
use Kanboard\Core\Translator;

class Plugin extends Base
{
    public function initialize()
    {
        error_log('CardNavigator: Starting initialization');
        
        // Asset hooks
        $this->hook->on('template:layout:css', array('template' => 'plugins/CardNavigator/Assets/css/card-navigator.css'));
        $this->hook->on('template:layout:js', array('template' => 'plugins/CardNavigator/Assets/js/card-navigator.js'));
        error_log('CardNavigator: Asset hooks registered');
        
        // Routes
        $this->route->addRoute('/card-navigator/next/:task_id', 'CardNavigatorController', 'next', 'CardNavigator');
        $this->route->addRoute('/card-navigator/prev/:task_id', 'CardNavigatorController', 'prev', 'CardNavigator');
        error_log('CardNavigator: Routes registered');
        
        error_log('CardNavigator: Initialization completed');
    }

    public function onStartup()
    {
        Translator::load($this->languageModel->getCurrentLanguage(), __DIR__ . '/Locale');
    }

    public function getPluginName()
    {
        return 'CardNavigator';
    }

    public function getPluginDescription()
    {
        return t('Navigate between cards in the detail view with floating arrows and Ctrl+left/right shortcuts');
    }

    public function getPluginAuthor()
    {
        return 'Ravisankar Pandian';
    }

    public function getPluginVersion()
    {
        return '1.0.0';
    }

    public function getCompatibleVersion()
    {
        return '>=1.2.20';
    }

    public function getClasses()
    {
        return array();
    }

    public function getPluginHomepage()
    {
        return 'https://github.com/oliyan/cardnavigator';
    }
}