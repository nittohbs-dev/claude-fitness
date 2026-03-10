import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '../store/workoutStore';
import { BODY_PARTS } from '../types';
import type { BodyPartId, WorkoutMenu, MenuExercise } from '../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

function ExerciseEditor({
  exercises,
  onChange,
}: {
  exercises: MenuExercise[];
  onChange: (ex: MenuExercise[]) => void;
}) {
  const add = () =>
    onChange([
      ...exercises,
      { name: '', defaultSets: 3, defaultReps: 10, defaultWeight: 0 },
    ]);
  const update = (i: number, field: keyof MenuExercise, value: string | number) => {
    const updated = exercises.map((e, idx) => (idx === i ? { ...e, [field]: value } : e));
    onChange(updated);
  };
  const remove = (i: number) => onChange(exercises.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {exercises.map((ex, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-2">
          <div className="flex gap-2 mb-1">
            <input
              type="text"
              placeholder="種目名"
              value={ex.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              className="flex-1 bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            />
            <button onClick={() => remove(i)} className="text-gray-500 hover:text-red-400">
              <X size={14} />
            </button>
          </div>
          <div className="flex gap-1">
            {(['defaultSets', 'defaultReps', 'defaultWeight'] as const).map((field) => (
              <div key={field} className="flex-1">
                <label className="text-xs text-gray-500">
                  {field === 'defaultSets' ? 'セット' : field === 'defaultReps' ? '回数' : '重量'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={ex[field]}
                  onChange={(e) => update(i, field, Number(e.target.value))}
                  className="w-full bg-gray-700 text-white text-sm text-center rounded px-1 py-1 border border-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white border border-dashed border-gray-700 rounded-lg py-2 justify-center"
      >
        <Plus size={14} /> 種目を追加
      </button>
    </div>
  );
}

function MenuCard({ menu, onEdit, onDelete }: { menu: WorkoutMenu; onEdit: () => void; onDelete: () => void }) {
  const part = BODY_PARTS.find((b) => b.id === menu.bodyPart)!;
  return (
    <motion.div
      className="bg-gray-900 rounded-2xl p-4 border border-gray-800"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-bold text-white">{menu.name}</span>
          <div className="text-xs text-gray-500">
            {part.emoji} {part.label} · {menu.exercises.length}種目
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-gray-400 hover:text-blue-400">
            <Edit2 size={15} />
          </button>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-400">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {menu.exercises.map((ex, i) => (
          <div key={i} className="flex items-center justify-between text-xs text-gray-400">
            <span>{ex.name || '（名称なし）'}</span>
            <span>
              {ex.defaultSets}×{ex.defaultReps}
              {ex.defaultWeight > 0 ? ` ${ex.defaultWeight}kg` : ''}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Menus() {
  const { menus, addMenu, updateMenu, deleteMenu } = useWorkoutStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [filterPart, setFilterPart] = useState<BodyPartId | 'all'>('all');
  const [draft, setDraft] = useState<{ name: string; bodyPart: BodyPartId; exercises: MenuExercise[] }>({
    name: '',
    bodyPart: 'arms',
    exercises: [],
  });

  const startNew = () => {
    setDraft({ name: '', bodyPart: 'arms', exercises: [] });
    setShowNew(true);
    setEditingId(null);
  };

  const startEdit = (menu: WorkoutMenu) => {
    setDraft({ name: menu.name, bodyPart: menu.bodyPart, exercises: [...menu.exercises] });
    setEditingId(menu.id);
    setShowNew(false);
  };

  const saveNew = () => {
    if (!draft.name) return;
    addMenu(draft);
    setShowNew(false);
  };

  const saveEdit = () => {
    if (!editingId || !draft.name) return;
    updateMenu({ ...draft, id: editingId });
    setEditingId(null);
  };

  const filteredMenus = menus.filter((m) => filterPart === 'all' || m.bodyPart === filterPart);

  return (
    <div className="flex flex-col px-4 pt-6 pb-28 min-h-screen max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-white">🏋️ メニュー管理</h2>
        <button
          onClick={startNew}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-2 rounded-lg"
        >
          <Plus size={14} /> 新規
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => setFilterPart('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold border ${filterPart === 'all' ? 'bg-gray-600 border-gray-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
        >
          全て
        </button>
        {BODY_PARTS.map((part) => (
          <button
            key={part.id}
            onClick={() => setFilterPart(part.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold border ${filterPart === part.id ? 'bg-red-600 border-red-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
          >
            {part.emoji} {part.label}
          </button>
        ))}
      </div>

      {/* New menu form */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            className="bg-gray-900 rounded-2xl p-4 border border-orange-800/40 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-sm font-bold text-white mb-3">新しいメニュー</h3>
            <input
              type="text"
              placeholder="メニュー名"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 mb-3"
            />
            <div className="flex gap-2 flex-wrap mb-3">
              {BODY_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setDraft((d) => ({ ...d, bodyPart: part.id }))}
                  className={`px-2 py-1 rounded-lg text-xs font-bold border ${draft.bodyPart === part.id ? 'bg-red-600 border-red-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-300'}`}
                >
                  {part.emoji} {part.label}
                </button>
              ))}
            </div>
            <ExerciseEditor
              exercises={draft.exercises}
              onChange={(ex) => setDraft((d) => ({ ...d, exercises: ex }))}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={saveNew}
                className="flex-1 flex items-center justify-center gap-1 bg-green-700 hover:bg-green-600 text-white text-sm py-2 rounded-lg"
              >
                <Save size={14} /> 保存
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="flex-1 bg-gray-800 text-gray-400 text-sm py-2 rounded-lg"
              >
                キャンセル
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu list */}
      <div className="flex flex-col gap-3">
        {filteredMenus.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-4xl mb-2">🏋️</p>
            <p>メニューがありません</p>
          </div>
        )}
        {filteredMenus.map((menu) =>
          editingId === menu.id ? (
            <motion.div
              key={menu.id}
              className="bg-gray-900 rounded-2xl p-4 border border-blue-800/40"
              layout
            >
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 mb-3"
              />
              <ExerciseEditor
                exercises={draft.exercises}
                onChange={(ex) => setDraft((d) => ({ ...d, exercises: ex }))}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={saveEdit}
                  className="flex-1 flex items-center justify-center gap-1 bg-green-700 text-white text-sm py-2 rounded-lg"
                >
                  <Save size={14} /> 保存
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 bg-gray-800 text-gray-400 text-sm py-2 rounded-lg"
                >
                  キャンセル
                </button>
              </div>
            </motion.div>
          ) : (
            <MenuCard
              key={menu.id}
              menu={menu}
              onEdit={() => startEdit(menu)}
              onDelete={() => deleteMenu(menu.id)}
            />
          )
        )}
      </div>
    </div>
  );
}
