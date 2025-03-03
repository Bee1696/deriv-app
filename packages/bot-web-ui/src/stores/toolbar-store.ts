import { action, makeObservable, observable } from 'mobx';
import { config, load, runGroupedEvents } from '@deriv/bot-skeleton';
import RootStore from './root-store';

interface IToolbarStore {
    is_animation_info_modal_open: boolean;
    is_dialog_open: boolean;
    file_name: string;
    has_undo_stack: boolean;
    has_redo_stack: boolean;
    onResetClick: () => void;
    closeResetDialog: () => void;
    onResetOkButtonClick: () => void;
    onSortClick: () => void;
    onUndoClick: (is_redo: boolean) => void;
    onZoomInOutClick: (is_zoom_in: boolean) => void;
    resetDefaultStrategy: () => void;
    setHasUndoStack: () => void;
    setHasRedoStack: () => void;
}

const Blockly = window.Blockly;
export default class ToolbarStore implements IToolbarStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_animation_info_modal_open: observable,
            is_dialog_open: observable,
            file_name: observable,
            has_undo_stack: observable,
            has_redo_stack: observable,
            onResetClick: action.bound,
            closeResetDialog: action.bound,
            onResetOkButtonClick: action.bound,
            onUndoClick: action.bound,
            resetDefaultStrategy: action.bound,
            setHasUndoStack: action.bound,
            setHasRedoStack: action.bound,
        });

        this.root_store = root_store;
    }

    is_animation_info_modal_open = false;
    is_dialog_open = false;
    file_name = config.default_file_name;
    has_undo_stack = false;
    has_redo_stack = false;

    onResetClick = (): void => {
        this.is_dialog_open = true;
    };

    closeResetDialog = (): void => {
        this.is_dialog_open = false;
    };

    onResetOkButtonClick = (): void => {
        runGroupedEvents(
            false,
            () => {
                this.resetDefaultStrategy();
            },
            'reset'
        );
        this.is_dialog_open = false;

        const { run_panel } = this.root_store;
        if (run_panel.is_running) {
            this.root_store.run_panel.stopBot();
        }
    };

    resetDefaultStrategy = async () => {
        const workspace = Blockly.derivWorkspace;
        workspace.current_strategy_id = Blockly.utils.genUid();
        await load({
            block_string: workspace.cached_xml.main,
            file_name: config.default_file_name,
            workspace,
            drop_event: null,
            strategy_id: null,
            from: null,
            showIncompatibleStrategyDialog: null,
        });
        workspace.strategy_to_load = workspace.cached_xml.main;
    };

    onSortClick = () => {
        Blockly.derivWorkspace.cleanUp();
    };

    onUndoClick = (is_redo: boolean): void => {
        Blockly.Events.setGroup('undo_clicked');
        Blockly.derivWorkspace.undo(is_redo);
        Blockly.svgResize(Blockly.derivWorkspace); // Called for CommentDelete event.
        this.setHasRedoStack();
        this.setHasUndoStack();
        Blockly.Events.setGroup(false);
    };

    onZoomInOutClick = (is_zoom_in: boolean): void => {
        const workspace = Blockly.derivWorkspace;
        const metrics = workspace.getMetrics();
        const addition = is_zoom_in ? 1 : -1;

        workspace.zoom(metrics.viewWidth / 2, metrics.viewHeight / 2, addition);
    };

    setHasUndoStack = (): void => {
        this.has_undo_stack = Blockly.derivWorkspace?.hasUndoStack();
    };

    setHasRedoStack = (): void => {
        this.has_redo_stack = Blockly.derivWorkspace?.hasRedoStack();
    };
}
